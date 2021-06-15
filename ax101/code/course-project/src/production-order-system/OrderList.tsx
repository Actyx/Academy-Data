// [[start:skeleton]]
// [[start:use-fish]]
import * as React from 'react'
// [[end:skeleton]]
import { useFish } from '@actyx-contrib/react-pond'
import { ProductionOrdersFish } from '../fish/productionOrdersFish'
// [[end:use-fish]]

// [[start:use-fish]]
// [[start:skeleton]]
export const OrderList = (): JSX.Element => {
  // [[end:skeleton]]
  const productionOrdersFish = useFish(ProductionOrdersFish.all)
  const orders = Object.values(productionOrdersFish.state.orders)
  // [[end:use-fish]]

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
      {/* [[start:bind-data]]  */}
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
      {/* [[end:bind-data]]  */}
    </table>
  )
  // [[start:use-fish]]
}
// [[end:use-fish]]
// [[end:skeleton]]
