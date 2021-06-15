// [[start:skeleton]]
import * as React from 'react'
// [[end:skeleton]]
import { useFish } from '@actyx-contrib/react-pond'
import { ProductionOrdersFish } from '../fish/productionOrdersFish'

// [[start:skeleton]]
export const OrderList = (): JSX.Element => {
  // [[end:skeleton]]
  const productionOrdersFish = useFish(ProductionOrdersFish.all)
  const orders = Object.values(productionOrdersFish.state.orders)

  // [[start:skeleton]]
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">State</th>
          <th scope="col">Product</th>
        </tr>
      </thead>
      <tbody>
        {/* [[end:skeleton]] */}
        {orders.map((order) => (
          <tr key={order.orderId}>
            <th scope="row">{order.orderId}</th>
            <td>{order.state}</td>
            <td>
              {order.amount} - {order.article}
            </td>
          </tr>
        ))}
        {/* [[start:skeleton]]  */}
      </tbody>
    </table>
  )
}
// [[end:skeleton]]
