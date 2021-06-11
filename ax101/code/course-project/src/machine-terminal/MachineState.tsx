import * as React from 'react'
import { useFishFn, usePond } from '@actyx-contrib/react-pond'
import { MachineFish } from '../fish/machineFish'
import { ProductionOrdersFish } from '../fish/productionOrdersFish'

type Props = {
  machineId: string
}

export const MachineState = ({ machineId }: Props): JSX.Element => {
  const machineFish = useFishFn(MachineFish.of, machineId)

  const pond = usePond()
  const finished = (orderId: string) => {
    ProductionOrdersFish.emitProductionOrderFinishedEvent(pond, orderId, machineId)
  }

  if (!machineFish) {
    return <div>loading...</div>
  }
  const state = machineFish.state

  return (
    <div className="card bg-light">
      <div className="card-header">{machineId}</div>
      <div className="card-body">
        <div>current Orders:</div>
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
                <td>
                  <button className="btn btn-success" onClick={() => finished(order)}>
                    Finished
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
