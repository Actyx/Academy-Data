import { Pond, PendingEmission, Tag, Fish, FishId } from '@actyx/pond'
import { MaterialBatchFishes } from './materialBatchFish'

// [[start:state]]
type UnknownState = {
    state: 'unknown'
    machineId: string
}
type FreeState = {
    state: 'free'
    machineId: string
    since: number
}
type EngagedState = {
    state: 'engaged'
    machineId: string
    since: number
    value: string
}

type BatchNumberScannerState = UnknownState | FreeState | EngagedState
// [[end:state]]

// [[start:events]]
// [[start:input-material-scanned-event]]
export type InputMaterialBatchScannedEvent = {
    eventType: 'inputMaterialBatchScanned'
    batchId: string
    machineId: string
}
// [[end:input-material-scanned-event]]

export type InputMaterialBatchLostEvent = {
    eventType: 'inputMaterialBatchLost'
    machineId: string
}
export type BatchNumberScannerEvent = InputMaterialBatchScannedEvent | InputMaterialBatchLostEvent
// [[end:events]]

// [[start:emitters]]
const emitInputMaterialBatchScanned = (
    pond: Pond,
    batchId: string,
    machineId: string,
): PendingEmission =>
    pond.emit(
        batchNummerScanTag
            .withId(machineId)
            .and(MaterialBatchFishes.tags.materialBatchTag.withId(batchId))
            .and(MaterialBatchFishes.tags.materialBatchScannedTag),
        {
            eventType: 'inputMaterialBatchScanned',
            batchId,
            machineId,
        },
    )

const emitInputMaterialBatchLost = (pond: Pond, machineId: string): PendingEmission =>
    pond.emit(batchNummerScanTag.withId(machineId), {
        eventType: 'inputMaterialBatchLost',
        machineId,
    })
// [[end:emitters]]

// [[start:tags]]
const batchNummerScanTag = Tag<BatchNumberScannerEvent>('BatchNummerScan')
// [[end:tags]]

export const BatchNumberScannerFishes = {
    tags: {
        batchNummerScanTag,
    },
    of: (machineId: string): Fish<BatchNumberScannerState, BatchNumberScannerEvent> => ({
        fishId: FishId.of('BatchNumberScannerFish', machineId, 0),
        initialState: {
            state: 'unknown',
            machineId,
        },
        where: batchNummerScanTag.withId(machineId),
        // [[start:on-event]]
        onEvent: (state, event, meta) => {
            switch (event.eventType) {
                case 'inputMaterialBatchScanned':
                    return {
                        state: 'engaged',
                        machineId,
                        value: event.batchId,
                        since: meta.timestampMicros,
                    }
                case 'inputMaterialBatchLost':
                    return {
                        state: 'free',
                        machineId,
                        since: meta.timestampMicros,
                    }
                default:
                    break
            }
            return state
        },
    }),
    // [[end:on-event]]
    emitInputMaterialBatchScanned,
    emitInputMaterialBatchLost,
}
