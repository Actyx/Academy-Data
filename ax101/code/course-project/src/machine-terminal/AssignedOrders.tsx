// [[start:skeleton]]
import * as React from 'react'
import { useFish, usePond } from '@actyx-contrib/react-pond'
import { ProductionOrdersFish } from '../fish/productionOrdersFish'

type Props = {
    machineId: string
}

// [[start:order-filter]]
// [[start:action]]
export const AssignedOrders = ({ machineId }: Props): JSX.Element => {
    // [[end:action]]
    const pond = usePond()
    const productionOrdersFish = useFish(ProductionOrdersFish.all)
    const orders = Object.values(productionOrdersFish.state.orders)
    // [[end:skeleton]]
    .filter((order) => order.machineId === machineId)
    .filter((order) => order.state !== 'finished')
    // [[end:order-filter]]
    
    const machineInProduction = orders.find((order) => order.state === 'started') !== undefined
    
    // [[start:action]]
    const started = (orderId: string) => {
        ProductionOrdersFish.emitProductionOrderStartedEvent(pond, orderId, machineId)
    }
    // [[end:action]]
    
    // [[start:skeleton]]
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">State</th>
          <th scope="col">Product</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {/* [[end:skeleton]]  */}
        {orders.map((order) => (
            <tr key={order.orderId}>
            <th scope="row">{order.orderId}</th>
            <td>{order.state}</td>
            <td>
              {order.amount} - {order.article}
            </td>
                {/* [[start:action]]  */}
            <td>
              {order.state === 'placed' && (
                  <button
                  className="btn btn-primary"
                  disabled={machineInProduction}
                  onClick={() => started(order.orderId)}
                  >
                  start
                </button>
              )}
            </td>
              {/* [[end:action]]  */}
          </tr>
        ))}
        {/* [[start:skeleton]]  */}
      </tbody>
    </table>
  )
}
// [[end:skeleton]]