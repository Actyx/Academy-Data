import * as React from 'react'
import { useFishFn } from '@actyx-contrib/react-pond'
import { BatchNumberScannerFishes } from '../fish/batchNumberScannerFish'
import { MaterialBatchFishes } from '../fish/materialBatchFish'

type CurrentBatchProps = {
  machineId: string
}

export const CurrentBatch = ({ machineId }: CurrentBatchProps): JSX.Element => {
  const scan = useFishFn(BatchNumberScannerFishes.of, machineId)

  return (
    <div className="card bg-light">
      <div className="card-header">Input material batch scanner</div>
      <div className="card-body">
        {(scan && scan.state.state === 'engaged' && <ShowBatch batchId={scan.state.value} />) || (
          <div>Nothing scanned</div>
        )}
      </div>
    </div>
  )
}

type ShowBatchProps = {
  batchId: string
}
export const ShowBatch = ({ batchId }: ShowBatchProps): JSX.Element => {
  const batchFish = useFishFn(MaterialBatchFishes.of, batchId)

  if (!batchFish || batchFish.state.state === 'unknown') {
    return <div>loading...</div>
  }
  const state = batchFish.state

  const byOrder = Object.entries(state.consumedByOrder)
  const byMachine = Object.entries(state.consumedByMachine)

  return (
    <>
      <table className="table">
        <tr>
          <td scope="row">batch number</td>
          <td>{state.batchId}</td>
        </tr>
        <tr>
          <td scope="row">batch size</td>
          <td>{state.batchSize}</td>
        </tr>
        <tr>
          <td scope="row">available Material</td>
          <td>{state.availableMaterial}</td>
        </tr>
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
      </table>
    </>
  )
}
