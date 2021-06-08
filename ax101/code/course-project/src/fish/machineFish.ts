// [[start:import]]
import { Fish, FishId } from '@actyx/pond'
import {
    ProductionOrderFinishedEvent,
    ProductionOrdersFish,
    ProductionOrderStartedEvent,
} from './productionOrdersFish'
// [[end:import]]

// [[start:state]]
export type MachineState = {
    machineId: string
    currentOrderId: string[]
}
// [[end:state]]

// [[start:construction]]
// [[start:skeleton]]
export const MachineFish = {
    tags: {},
    of: (
        machineId: string,
    ): Fish<MachineState, ProductionOrderStartedEvent | ProductionOrderFinishedEvent> => ({
        // [[end:construction]]
        fishId: FishId.of('MachineState', machineId, 0),
        initialState: { machineId, currentOrderId: [] },
        where: ProductionOrdersFish.tags.productionOrderStartedByTag
            .withId(machineId)
            .or(
                ProductionOrdersFish.tags.productionOrderFinishedByTag
                    .withId(machineId)
            ),
        // [[start:on-event]]
        onEvent: (state, event) => {
            // [[end:skeleton]]
            switch (event.eventType) {
                case 'productionOrderStarted':
                    state.currentOrderId.push(event.orderId)
                    return state

                case 'productionOrderFinished':
                    state.currentOrderId = state.currentOrderId.filter((id) => id !== event.orderId)
                    return state
                default:
                    break
            }
            return state
            // [[start:skeleton]]
        },
        // [[end:on-event]]
        // [[start:construction]]
    }),
}
// [[end:construction]]
// [[end:skeleton]]
