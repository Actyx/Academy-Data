// [[start:app-skeleton]]
import * as React from 'react'
import { OrderList } from './OrderList'

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
        <h2>Production Orders</h2>
        {/* [[end:app-skeleton]] */}
        <OrderList />
        {/* [[start:app-skeleton]] */}
      </div>
    </div>
  )
}
// [[end:app-skeleton]]
