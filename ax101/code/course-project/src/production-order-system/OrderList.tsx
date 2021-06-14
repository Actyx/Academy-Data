import * as React from 'react'
import { useFish } from '@actyx-contrib/react-pond'
import { ProductionOrdersFish } from '../fish/productionOrdersFish'

export const OrderList = (): JSX.Element => {
  const productionOrdersFish = useFish(ProductionOrdersFish.all)
  const orders = Object.values(productionOrdersFish.state.orders)

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
        {orders.map((order) => (
          <tr key={order.orderId}>
            <th scope="row">{order.orderId}</th>
            <td>{order.state}</td>
            <td>
              {order.amount} - {order.article}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}