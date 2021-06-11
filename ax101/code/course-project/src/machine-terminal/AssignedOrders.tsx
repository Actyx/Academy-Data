import * as React from 'react'
import { useFish, usePond } from '@actyx-contrib/react-pond'
import { ProductionOrdersFish } from '../fish/productionOrdersFish'

type Props = {
  machineId: string
}

export const AssignedOrders = ({ machineId }: Props): JSX.Element => {
  const productionOrdersFish = useFish(ProductionOrdersFish.all)
  const orders = Object.values(productionOrdersFish.state.orders)
    .filter((order) => order.machineId === machineId)
    .filter((order) => order.state !== 'finished')

  const machineInProduction = orders.find((order) => order.state === 'started') !== undefined

  const pond = usePond()
  const started = (orderId: string) => {
    ProductionOrdersFish.emitProductionOrderStartedEvent(pond, orderId, machineId)
  }

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
        {orders.map((order) => (
          <tr key={order.orderId}>
            <th scope="row">{order.orderId}</th>
            <td>{order.state}</td>
            <td>
              {order.amount} - {order.article}
            </td>
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
          </tr>
        ))}
      </tbody>
    </table>
  )
}
