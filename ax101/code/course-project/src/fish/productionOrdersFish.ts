// [[start:fish-skeleton]]
import { Fish, FishId, Tag } from "@actyx/pond"
// [[end:fish-skeleton]]

// [[start:order-type]]
type Order = {
    orderId: string
    state: 'placed' | 'started' | 'finished'
    machineId: string
    customer: string
    article: string
    amount: number
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
} & Order
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
const productionOrderTag = Tag<Event>('ProductionOrder')
const productionOrderStartedByTag = Tag<ProductionOrderStartedEvent>('ProductionOrder.startedBy')
const productionOrderFinishedByTag = Tag<ProductionOrderFinishedEvent>('ProductionOrder.finishedBy')
// [[end:tags]]

// [[start:fish-skeleton]]
// [[start:fish-tags]]
export const ProductionOrdersFish = {
// [[end:fish-skeleton]]
    tags: {
        productionOrderTag, 
        productionOrderStartedByTag,
        productionOrderFinishedByTag
    },
    // [[start:fish-skeleton]]
    // twin implementation
    all: {
        // [[end:fish-tags]]
        fishId: FishId.of('ProductionOrders', 'all', 0),
        initialState: { orders: {} }, // initial state value of type ProductionOrdersState
        where: productionOrderTag,
        onEvent: (state: ProductionOrdersState, event: ProductionOrderEvent) => {
            // [[end:fish-skeleton]]
            // [[start:fish-skeleton]]
            return state
        }
    } as Fish<ProductionOrdersState, ProductionOrderEvent>,
    // [[end:fish-skeleton]]

// [[start:fish-skeleton]]
}
// [[end:fish-skeleton]]
