import { Fish, FishId, PendingEmission, Pond, Tag } from '@actyx/pond'
import { ProductionOrdersFish } from './productionOrdersFish'
import { InputMaterialBatchScannedEvent } from './batchNumberScannerFish'


// [[start:state]]
export type UnknownState = {
  state: 'unknown'
  batchId: string
}
export type DefinedState = {
  state: 'defined'
  batchId: string
  batchSize: number
  availableMaterial: number
  consumedByOrder: Record<string, number>
  consumedByMachine: Record<string, number>
}
export type MaterialBatchState = UnknownState | DefinedState
// [[end:state]]

// [[start:events]]
export type InputMaterialConsumedEvent = {
  eventType: 'inputMaterialConsumed'
  batchId: string
  orderId: string
  device: string
}
export type MaterialBatchEvent = InputMaterialConsumedEvent
// [[end:events]]

// [[start:emitter]]
const emitInputMaterialConsumed = (
  pond: Pond,
  batchId: string,
  orderId: string,
  device: string,
): PendingEmission =>
  pond.emit(
    materialBatchTag
      .withId(batchId)
      .and(ProductionOrdersFish.tags.productionOrderTag.withId(orderId)),
    {
      eventType: 'inputMaterialConsumed',
      batchId,
      orderId,
      device,
    },
  )
// [[end:emitter]]

// [[start:tags]]
const materialBatchTag = Tag<MaterialBatchEvent | InputMaterialBatchScannedEvent>('MaterialBatch')
const materialBatchScannedTag = Tag<InputMaterialBatchScannedEvent>('MaterialBatch.scanned')
// [[end:tags]]

// [[start:group]]
export const MaterialBatchFishes = {
  tags: {
    materialBatchTag,
    materialBatchScannedTag
  },
  of: (
    batchId: string,
    ): Fish<MaterialBatchState, MaterialBatchEvent | InputMaterialBatchScannedEvent> => ({
      // [[end:group]]
      // [[start:entity]]
      fishId: FishId.of('MaterialBatch', batchId, 0),
      initialState: {
        state: 'unknown',
        batchId,
      },
      where: materialBatchTag.withId(batchId),
      // [[start:entity-on-event]]
      onEvent: (state, event) => {
        // [[end:entity]]
        switch (event.eventType) {
          case 'inputMaterialBatchScanned': {
            if (state.state === 'unknown') {
              return {
                state: 'defined',
                batchId,
                batchSize: 25, // all pallets have the same size in our case ...
                availableMaterial: 25, // ... and are always completely filled
                consumedByMachine: {},
                consumedByOrder: {},
              }
            } else {
              // Only the first scan creates the batch in the system.
              return state
            }
          }
          case 'inputMaterialConsumed': {
            if (state.state === 'defined') {
              state.availableMaterial -= 1
              
            const previousConsumedByMachine = state.consumedByMachine[event.device] || 0
            state.consumedByMachine[event.device] = previousConsumedByMachine + 1
            
            const previousConsumedByOrder = state.consumedByOrder[event.orderId] || 0
            state.consumedByOrder[event.orderId] = previousConsumedByOrder + 1
          }
          else {
            // Exercise: Think about when this case might happen and how to handle it.
          }
          return state
        }
        // [[start:entity]]
      }
      // [[end:entity]]
    },
    // [[end:entity-on-event]]
    // [[start:group]]
  }),
  // [[start:all]]
  all: {
    // [[end:group]]
    fishId: FishId.of('MaterialBatchRegistry', 'all', 0),
    initialState: {},
    where: materialBatchScannedTag,
    onEvent: (state, event) => {
      if (event.eventType === 'inputMaterialBatchScanned') {
        state[event.batchId] = true
      }
      return state
    },
  } as Fish<Record<string, boolean>, InputMaterialBatchScannedEvent>,
  // [[end:all]]
  // [[start:group]]

  emitInputMaterialConsumed,
}
// [[end:group]]

