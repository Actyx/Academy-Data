// [[start:fish-skeleton]]
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
// [[end:tags]]

// [[start:fish-skeleton]]
export const ProductionOrdersFish = {
// [[end:fish-skeleton]]

    // [[start:fish-tags]]
    tags: {
        productionOrderTag,      
    },
    // [[end:fish-tags]]

    // [[start:fish-skeleton]]
    // twin implementation
    all: {
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
