// [[start:app-skeleton]]
import * as React from 'react'
// [[start:add-list]]
import { OrderList } from './OrderList'
// [[end:add-list]]

export const App = (): JSX.Element => {
  return (
    <div className="container">
      <h1>Production Order System</h1>
      <div>
        <h2>Create Production Order</h2>
        {/* [[end:app-skeleton]] */}
        {/* [[start:app-skeleton]] */}
      </div>
      <div>
        {/* [[start:add-list]] */}
        <h2>Production Orders</h2>
        {/* [[end:app-skeleton]] */}
        <OrderList />
        {/* [[end:add-list]] */}
        {/* [[start:app-skeleton]] */}
      </div>
    </div>
  )
}
// [[end:app-skeleton]]
