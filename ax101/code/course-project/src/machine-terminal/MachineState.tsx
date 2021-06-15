// [[start:skeleton]]
import * as React from 'react'
import { useFishFn, usePond } from '@actyx-contrib/react-pond'
import { MachineFish } from '../fish/machineFish'
import { ProductionOrdersFish } from '../fish/productionOrdersFish'

type Props = {
  machineId: string
}

export const MachineState = ({ machineId }: Props): JSX.Element => {
  const pond = usePond()
  // [[end:skeleton]]

  // [[start:machine-fish]]
  const machineFish = useFishFn(MachineFish.of, machineId)
  if (!machineFish) {
    return <div>loading...</div>
  }
  const state = machineFish.state
  // [[end:machine-fish]]

  // [[start:action]]
  const finished = (orderId: string) => {
    ProductionOrdersFish.emitProductionOrderFinishedEvent(pond, orderId, machineId)
  }
  // [[end:action]]

  // [[start:skeleton]]
  return (
    <div className="card bg-light">
      {/* [[start:machine-fish-ui]] */}
      <div className="card-header">{machineId}</div>
      <div className="card-body">
        <div>Current Orders:</div>
        {/* [[end:skeleton]] */}
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">action</th>
            </tr>
          </thead>
          <tbody>
            {state.currentOrderId.map((order) => (
              <tr key={order}>
                <th scope="row">{order}</th>
                {/* [[start:action]] */}
                <td>
                  {/* [[end:machine-fish-ui]] */}
                  <button className="btn btn-success" onClick={() => finished(order)}>
                    Finished
                  </button>
                  {/* [[start:machine-fish-ui]] */}
                </td>
                {/* [[end:action]] */}
              </tr>
            ))}
          </tbody>
        </table>
        {/* [[start:skeleton]] */}
      </div>
      {/* [[end:machine-fish-ui]] */}
    </div>
  )
}
// [[start:skeleton]]
