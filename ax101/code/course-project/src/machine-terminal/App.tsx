import * as React from 'react'
import { AssignedOrders } from './AssignedOrders'

export const App = (): JSX.Element => {
  const machineId = 'machine1'

  return (
    <div className="container">
      <h1>Machine Terminal {machineId}</h1>
      <AssignedOrders machineId={machineId} />
    </div>
  )
}
