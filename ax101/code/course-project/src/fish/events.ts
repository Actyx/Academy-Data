// [[start:machine-state-event]]
import * as t from 'io-ts'
import { ActyxEvent } from '@actyx/pond'
// [[end:machine-state-event]]
// [[start:machine-state-changed-event-type-check]]
import { isRight } from 'fp-ts/lib/Either'
// [[end:machine-state-changed-event-type-check]]

// [[start:machine-state-event]]
export const machineStateChangedEvent = t.intersection([
    t.type({
        eventType: t.literal('machineStateChanged'),
        device: t.string,
        state: t.number,
    }),
    t.partial({
        stateDesc: t.string,
    }),
])
export type MachineStateChangedEvent = t.TypeOf<typeof machineStateChangedEvent>
// [[end:machine-state-event]]

// [[start:machine-state-changed-event-type-check]]
export const isMachineStateChangedEvent = (
    event: ActyxEvent<unknown>,
): event is ActyxEvent<MachineStateChangedEvent> => isRight(machineStateChangedEvent.decode(event.payload))
// [[end:machine-state-changed-event-type-check]]
