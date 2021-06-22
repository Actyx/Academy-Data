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
      fishId: FishId.of('MaterialBatch', batchId, 0),
      initialState: {
        state: 'unknown',
        batchId,
      },
      where: materialBatchTag.withId(batchId),
      onEvent: (state, event) => {
        console.log(event)
        switch (event.eventType) {
          case 'inputMaterialBatchScanned': {
            if (state.state === 'unknown') {
              return {
                state: 'defined',
                batchId,
                batchSize: 25,
                availableMaterial: 25,
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
              // Manipulate state if the batch is defined.
              state.availableMaterial -= 1
              
              const lastConsumedByMachine = state.consumedByMachine[event.device] || 0
              state.consumedByMachine[event.device] = lastConsumedByMachine + 1
              
              const lastConsumedByOrder = state.consumedByOrder[event.orderId] || 0
              state.consumedByOrder[event.orderId] = lastConsumedByOrder + 1
            }
            // We should add a hint, that in this use-case the inputMaterialConsumed can not appear before a inputMaterialBatchScanned
            // was triggered. (causality)
            // Fullfil all possible cases is the easy solution in a evtl-const-system.
          //   But if you know the domain, some cases will never happen and you wast your time :-)
          /* we should skip this for now and ignore the event.
          *  else {
           *      state = MaterialBatchFishes.of(batchId).onEvent(state, {
           *          eventType: 'inputMaterialBatchScanned',
           *          machineId: event.device,
           *          batchId,
           *      }, metadata)
           *  }
          */
         return state
        }
      }
      return state
    },
    // [[start:group]]
  }),
  all: { /* ... */ },
  
  emitInputMaterialConsumed,
}
// [[end:group]]

