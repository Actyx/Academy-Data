import * as React from 'react'
import { freezeBatch } from './controller/batchData'
import { batchData } from './model/batchData'
import { OrderList } from './OrderList'
import { PlaceOrder } from './PlaceOrder'
import { BatchList } from './view/BatchList'

export const App = (): JSX.Element => {
  const [page, setPage] = React.useState('orders')

  const orders = (page: string) => {
    if (page === 'orders') {
      return (
        <div className="row mt-4">
          <div className="col-5">
            <PlaceOrder />
          </div>
          <div className="col-7">
            <OrderList />
          </div>
        </div>
      )
    }
    return undefined
  }

  const batches = (page: string) => {
    if (page === 'batches') {
      const allBatches = batchData()
      return (
        <div className="row mt-4">
          <div className="col-12">
            <BatchList allBatches={allBatches} onFreeze={freezeBatch} />
          </div>
        </div>
      )
    }
    return undefined
  }

  return (
    <div className="container">
      <div className="row mt-4">
        <div className="col-12">
          <h1>Production Order System</h1>
        </div>
      </div>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a className="nav-link active" onClick={() => setPage('orders')}>
            Orders
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" onClick={() => setPage('batches')}>
            Batches
          </a>
        </li>
      </ul>
      {orders(page)}
      {batches(page)}
    </div>
  )
}
