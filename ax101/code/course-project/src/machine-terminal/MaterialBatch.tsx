import * as React from 'react'
// [[start:add-batch-info]]
import { useFishFn } from '@actyx-contrib/react-pond'
import { MaterialBatchFishes } from '../fish/materialBatchFish'
// [[end:add-batch-info]]

// [[start:material-batch-component]]
type MaterialBatchProps = {
  batchId: string
}

export const MaterialBatch = ({ batchId }: MaterialBatchProps): JSX.Element => {
  // [[end:material-batch-component]]

  // [[start:add-batch-info]]
  const batchFish = useFishFn(MaterialBatchFishes.of, batchId)

  if (!batchFish || batchFish.state.state === 'unknown') {
    return <div>loading...</div>
  }
  const state = batchFish.state
  // [[end:add-batch-info]]

  // [[start:add-batch-per-order]]
  const byOrder = Object.entries(batchFish.state.consumedByOrder)
  // [[end:add-batch-per-order]]
  const byMachine = Object.entries(state.consumedByMachine)

  // [[start:material-batch-component]]
  return (
    <table className="table">
      <tbody>
        {/* [[end:material-batch-component]] */}
        {/* [[start:add-batch-info]] */}
        <tr>
          <td scope="row">Batch number</td>
          <td>{state.batchId}</td>
        </tr>
        {/* [[end:add-batch-info]] */}
        <tr>
          <td scope="row">Batch size</td>
          <td>{state.batchSize}</td>
        </tr>
        <tr>
          <td scope="row">Available material</td>
          <td>{state.availableMaterial}</td>
        </tr>
        {/* [[start:add-batch-per-order]] */}
        <tr>
          <th scope="col" colSpan={2}>
            Consumed material by Production Order
          </th>
        </tr>
        {byOrder.map(([order, amount]) => (
          <tr key={order}>
            <td scope="row">{order}</td>
            <td>{amount}</td>
          </tr>
        ))}
        {/* [[end:add-batch-per-order]] */}
        <tr>
          <th scope="col" colSpan={2}>
            Consumed material by Machine
          </th>
        </tr>
        {byMachine.map(([machine, amount]) => (
          <tr key={machine}>
            <td scope="row">{machine}</td>
            <td>{amount}</td>
          </tr>
        ))}
        {/* [[start:material-batch-component]] */}
      </tbody>
    </table>
  )
}
// [[end:material-batch-component]]
