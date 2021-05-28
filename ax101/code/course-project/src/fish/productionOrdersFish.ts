import { Fish, FishId, Tag } from "@actyx/pond"

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
type ProductionOrdersState = {
    orders: Record<string, Order>
}
// [[end:orders-state-type]]

// [[start:event-type]]
type ProductionOrderEvent = undefined
// [[end:event-type]]

// [[start:tags]]
const productionOrderTag = Tag<Event>('ProductionOrder')

// [[end:tags]]

// [[start:fish-skeleton]]
export const ProductionOrdersFish = {
    // tags
    tags: {
        // [[end:fish-skeleton]]
        productionOrderTag,      
        // [[start:fish-skeleton]]
    },
    // [[end:fish-skeleton]]

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
    //emitters

    // [[start:fish-skeleton]]
}
// [[end:fish-skeleton]]