
// [[start: order-type]]
type Order = {
    orderId: string
    state: 'placed' | 'started' | 'finished'
    machineId: string
    customer: string
    article: string
    amount: number
}
// [[end: order-type]]

// [[start: orders-state-type]]
type ProductionOrdersState = {
    orders: Record<string, Order>
}
// [[end: orders-state-type]]