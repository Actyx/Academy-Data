import * as React from 'react'
import { OrderList } from './OrderList'
import { PlaceOrder } from './PlaceOrder'

export const App = (): JSX.Element => {
  return (
    <div className="container">
      <div className="row mt-4">
        <div className="col-12">
          <h1>Production Order System</h1>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-5">
          <PlaceOrder />
        </div>
        <div className="col-7">
          <OrderList />
        </div>
      </div>
    </div>
  )
}
