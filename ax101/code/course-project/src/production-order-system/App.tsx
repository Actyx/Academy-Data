import * as React from 'react'
import { freezeBatch } from './controller/batchController'
import { batchData } from './model/batchData'
import { BatchList } from './view/BatchList'
import { OrderList } from './OrderList'
import { OrderForm } from './OrderForm'
import { BrowserRouter as Router, Switch, Route, NavLink, Redirect } from 'react-router-dom'

export const App = (): JSX.Element => {
  const allBatches = batchData()

  return (
    <Router>
      <div className="container">
        <div className="row mt-4">
          <div className="col-12">
            <h1>Production Order System</h1>
          </div>
        </div>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <NavLink to="/orders" className="nav-link" activeClassName="active">
              Orders
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/batches" className="nav-link" activeClassName="active">
              Batches
            </NavLink>
          </li>
        </ul>
        <Switch>
          <Route exact path="/orders">
            <div className="row mt-4">
              <div className="col-5">
                <OrderForm />
              </div>
              <div className="col-7">
                <OrderList />
              </div>
            </div>
          </Route>
          <Route exact path="/batches">
            <div className="row mt-4">
              <div className="col-12">
                <BatchList allBatches={allBatches} onFreeze={freezeBatch} />
              </div>
            </div>
          </Route>
          <Route path="*">
            <Redirect to="/orders" />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}
