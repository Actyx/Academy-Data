import * as React from 'react'
import { useFishFn } from '@actyx-contrib/react-pond'
import { MaterialBatchFishes } from '../fish/materialBatchFish'

// [[start:material-batch-component]]
type MaterialBatchProps = {
  batchId: string
}

export const MaterialBatch = ({ batchId }: MaterialBatchProps): JSX.Element => {
  // [[end:material-batch-component]]
  const batchFish = useFishFn(MaterialBatchFishes.of, batchId)

  if (!batchFish || batchFish.state.state === 'unknown') {
    return <div>loading...</div>
  }
  const state = batchFish.state

  const byOrder = Object.entries(batchFish.state.consumedByOrder)
  /*
  homework:
  const byMachine = Object.entries(state.consumedByMachine)
  */

// [[start:material-batch-component]]
return (
  <table className="table">
        <tbody>
         {/* [[end:material-batch-component]] */} 
          <tr>
            <td scope="row">batch number</td>
            <td>{state.batchId}</td>
          </tr>
          {/*
          homework:
          <tr>
            <td scope="row">batch size</td>
            <td>{state.batchSize}</td>
          </tr>
          <tr>
            <td scope="row">available Material</td>
            <td>{state.availableMaterial}</td>
          </tr>
          */}
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
          {/* Homework: <tr>
            <th scope="col" colSpan={2}>
              Consumed material by Machine
            </th>
          </tr>
          {byMachine.map(([machine, amount]) => (
            <tr key={machine}>
              <td scope="row">{machine}</td>
              <td>{amount}</td>
            </tr>
          ))} */}
        {/* [[start:material-batch-component]] */} 
        </tbody>
      </table>
  )
}
// [[end:material-batch-component]]
