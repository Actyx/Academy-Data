import * as React from 'react'
import { AssignedOrders } from './AssignedOrders'
import { MachineState } from './MachineState'

export const App = (): JSX.Element => {
  const machineId = 'machine1'

  return (
    <div className="container">
      <div className="row mt-4">
        <div className="col-12">
          <h1>Machine Terminal {machineId}</h1>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-5">
          <MachineState machineId={machineId} />
        </div>
        <div className="col-7">
          <AssignedOrders machineId={machineId} />
        </div>
      </div>
    </div>
  )
}
