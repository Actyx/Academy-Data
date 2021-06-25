// [[start:fish-skeleton]]
import { Fish, FishId, PendingEmission, Pond, Tag } from "@actyx/pond"
import { InputMaterialConsumedEvent } from "./materialBatchFish"
// [[end:fish-skeleton]]

// [[start:order-type]]
type Order = {
    orderId: string
    state: 'placed' | 'started' | 'finished'
    machineId: string
    article: string
    amount: number
    consumedMaterial: Record<string, number>
}
// [[end:order-type]]

// [[start:orders-state-type]]
export type ProductionOrdersState = {
    orders: Record<string, Order>
}
// [[end:orders-state-type]]

//[[start:event-type-created]]
export type ProductionOrderCreatedEvent = {
    eventType: 'productionOrderCreated'
    orderId: string
    machineId: string
    article: string
    amount: number
}
//[[end:event-type-created]]

//[[start:event-type-started]]
export type ProductionOrderStartedEvent = {
    eventType: 'productionOrderStarted',
    orderId: string
    machineId: string
}
//[[end:event-type-started]]

//[[start:event-type-finished]]
export type ProductionOrderFinishedEvent = {
    eventType: 'productionOrderFinished',
    orderId: string
    machineId: string
}
//[[end:event-type-finished]]

// [[start:event-type-po]]
type ProductionOrderEvent =
    | ProductionOrderCreatedEvent
    | ProductionOrderStartedEvent
    | ProductionOrderFinishedEvent
// [[end:event-type-po]]

// [[start:tags]]
const productionOrderTag = Tag<ProductionOrderEvent | InputMaterialConsumedEvent>('ProductionOrder')
const productionOrderCreatedTag = Tag<ProductionOrderCreatedEvent>('ProductionOrder.created')
const productionOrderStartedByTag = Tag<ProductionOrderStartedEvent>('ProductionOrder.startedBy')
const productionOrderFinishedByTag = Tag<ProductionOrderFinishedEvent>('ProductionOrder.finishedBy')
// [[end:tags]]

// [[start:emit-created]]
export const emitProductionOrderCreatedEvent = (
    pond: Pond,
    orderId: string,
    machineId: string,
    article: string,
    amount: number,
): PendingEmission =>
    pond.emit(productionOrderTag.withId(orderId)
        .and(productionOrderCreatedTag), 
        {
            eventType: 'productionOrderCreated',
            orderId,
            machineId,
            article,
            amount,
        })
// [[end:emit-created]]

// [[start:emit-started]]
export const emitProductionOrderStartedEvent = (
    pond: Pond,
    orderId: string,
    machineId: string,
): PendingEmission =>
    pond.emit(
        productionOrderTag.withId(orderId)
            .and(productionOrderStartedByTag.withId(machineId)),
        {
            eventType: 'productionOrderStarted',
            orderId,
            machineId,
        })
// [[end:emit-started]]

// [[start:emit-finished]]
export const emitProductionOrderFinishedEvent = (
    pond: Pond,
    orderId: string,
    machineId: string,
): PendingEmission =>
    pond.emit(
        productionOrderTag.withId(orderId)
            .and(productionOrderFinishedByTag.withId(machineId)),
        {
            eventType: 'productionOrderFinished',
            orderId,
            machineId,
        },
    )
// [[end:emit-finished]]

// [[start:fish-skeleton]]
// [[start:fish-tags]]
// [[start:emitters]]
export const ProductionOrdersFish = {
    // [[end:emitters]]
    // [[end:fish-skeleton]]
    // [[start:add-tag]]
    tags: {
        productionOrderTag,
        productionOrderCreatedTag,
        productionOrderStartedByTag,
        productionOrderFinishedByTag
    },
    // [[end:add-tag]]
    // [[start:fish-skeleton]]
    // twin implementation
    // [[start:emitters]]
    // [[start:add-InputMaterialConsumedEvent-to-ProductionOrder-tag]]
    all: {
        // [[end:add-InputMaterialConsumedEvent-to-ProductionOrder-tag]]
        // [[end:emitters]]
        // [[end:fish-tags]]
        fishId: FishId.of('ProductionOrders', 'all', 1),
        initialState: { orders: {} }, // initial state value of type ProductionOrdersState
        where: productionOrderTag,
        // [[start:on-event]]
        // [[start:on-event-1]]
        // [[start:add-consumed-material-to-fish]]
        onEvent: (state, event) => {
            // [[end:add-consumed-material-to-fish]]
            // [[end:fish-skeleton]]
            switch (event.eventType) {
                case 'productionOrderCreated':
                    state.orders[event.orderId] = {
                        orderId: event.orderId,
                        state: 'placed',
                        machineId: event.machineId,
                        amount: event.amount,
                        article: event.article,
                        consumedMaterial: {},
                    }
                    return state

                case 'productionOrderStarted':
                    if (state.orders[event.orderId]) {
                        state.orders[event.orderId].state = 'started'
                    }
                    // [[end:on-event-1]]
                    else {
                        state.orders[event.orderId] = {
                            orderId: event.orderId,
                            state: 'started',
                            machineId: event.machineId,
                            amount: -1,
                            article: 'unknown',
                            consumedMaterial: {},
                        }
                    }
                    // [[start:on-event-1]]
                    return state

                case 'productionOrderFinished':
                    if (state.orders[event.orderId]) {
                        state.orders[event.orderId].state = 'finished'
                    }
                    // [[end:on-event-1]]
                    else {
                        state.orders[event.orderId] = {
                            orderId: event.orderId,
                            state: 'finished',
                            machineId: event.machineId,
                            amount: -1,
                            article: 'unknown',
                            consumedMaterial: {},
                        }
                    }
                    // [[start:on-event-1]]
                    return state

                // [[start:add-consumed-material-to-fish]]
                case 'inputMaterialConsumed':
                    if (state.orders[event.orderId]) {
                        // Get the last value. If undefined, the value is 0.
                        const lastValue = state.orders[event.orderId].consumedMaterial[event.batchId] || 0
                        state.orders[event.orderId].consumedMaterial[event.batchId] = lastValue + 1
                    } else {
                        state.orders[event.orderId] = {
                            orderId: event.orderId,
                            state: 'started',
                            machineId: event.device,
                            amount: -1,
                            article: 'unknown',
                            consumedMaterial: {
                                [event.batchId]: 1,
                            },
                        }
                    }
                    // [[end:add-consumed-material-to-fish]]
                    return state

                default:
                    break
            }
            // [[start:fish-skeleton]]
            return state
        }
        // [[end:on-event-1]]
        // [[end:on-event]]
        // [[start:emitters]]
        // [[start:add-InputMaterialConsumedEvent-to-ProductionOrder-tag]]
    } as Fish<ProductionOrdersState, ProductionOrderEvent | InputMaterialConsumedEvent>,
    // [[end:add-InputMaterialConsumedEvent-to-ProductionOrder-tag]]

    // [[start:open-registry]]
    openAssignedToMachine: (
        machineId: string,
        ): Fish<Record<string, boolean>, ProductionOrderEvent | ProductionOrderFinishedEvent> => ({
            fishId: FishId.of('ProductionOrders.openAssignedToMachine', machineId, 0),
            initialState: {}, // initial state with no known production order id
            where: productionOrderCreatedTag.or(productionOrderFinishedByTag.withId(machineId)),
            onEvent: (state, event) => {
                switch (event.eventType) {
                    case 'productionOrderCreated':
                        state[event.orderId] = true
                        return state
                    }
                    return state
                },
            }),
    // [[end:open-registry]]
    // [[end:fish-skeleton]]
    emitProductionOrderCreatedEvent,
    emitProductionOrderStartedEvent,
    emitProductionOrderFinishedEvent,
    // [[end:emitters]]

    // [[start:fish-skeleton]]
}
// [[end:fish-skeleton]]
