import * as React from 'react'
import { BatchData } from '../model/batchData'

type BatchListComponentProps = {
  allBatches: BatchData
  onFreeze: (batchId: string) => void
}
export const BatchList = ({ allBatches, onFreeze }: BatchListComponentProps): JSX.Element => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">State</th>
          <th scope="col">Product</th>
        </tr>
      </thead>
      <tbody>
        {allBatches.map(({ batchId, batchSize, availableMaterial, machines, orders }) => (
          <tr key={batchId}>
            <th scope="row">{batchId}</th>
            <td>{batchSize}</td>
            <td>{availableMaterial}</td>
            <td>{machines}</td>
            <td>{orders}</td>
            <td>
              <button onClick={() => onFreeze(batchId)}>freeze</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
