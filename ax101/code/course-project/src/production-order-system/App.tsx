// [[start:import]]
import * as React from 'react'
import { freezeBatch } from './controller/batchController'
import { batchData } from './model/batchData'
import { BatchList } from './view/BatchList'
import { OrderList } from './OrderList'
import { OrderForm } from './OrderForm'
import { BrowserRouter as Router, Switch, Route, NavLink, Redirect } from 'react-router-dom'
// [[end:import]]

// [[start:batch]]
export const App = (): JSX.Element => {
  const allBatches = batchData()
  // [[end:batch]]
  
  // [[start:batch]]
  return (
    <Router>
      <div className="container">
        <div className="row mt-4">
          <div className="col-12">
            <h1>Production Order System</h1>
          </div>
        </div>
        <ul className="nav nav-tabs">
          { /* [[end:batch]] */ }
          <li className="nav-item">
            <NavLink to="/orders" className="nav-link" activeClassName="active">
              Orders
            </NavLink>
          </li>
          { /* [[start:batch]] */ }
          <li className="nav-item">
            <NavLink to="/batches" className="nav-link" activeClassName="active">
              Batches
            </NavLink>
          </li>
          { /* [[end:batch]] */ }
        </ul>
          { /* [[start:batch]] */ }
        <Switch>
          { /* [[end:batch]] */ }
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
          { /* [[start:batch]] */ }
          <Route exact path="/batches">
            <div className="row mt-4">
              <div className="col-12">
                <BatchList allBatches={allBatches} onFreeze={freezeBatch} />
              </div>
            </div>
          </Route>
          { /* [[end:batch]] */ }
          { /* [[start:redirect]] */ }
          <Route path="*">
            <Redirect to="/orders" />
          </Route>
          { /* [[end:redirect]] */ }
          { /* [[start:batch]] */ }
        </Switch>
      </div>
    </Router>
  )
}
// [[end:batch]]
