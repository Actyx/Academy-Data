// [[start:component]]
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
          <th scope="col">Batch Number</th>
          <th scope="col">Size</th>
          <th scope="col">available material</th>
          <th scope="col">used by</th>
          <th scope="col">used for order</th>
          <th scope="col"></th>
        </tr>
      </thead>
      { /* [[start:binding]] */ }
      <tbody>
      { /* [[end:component]] */ }
        {allBatches.map(({ batchId, batchSize, availableMaterial, machines, orders }) => (
          <tr key={batchId}>
            <th scope="row">{batchId.substr(0, 13)}</th>
            <td>{batchSize}</td>
            <td>{availableMaterial}</td>
            <td>{machines.join(', ')}</td>
            <td>{orders.join(', ')}</td>
            <td>
              <button className="btn btn-danger" onClick={() => onFreeze(batchId)}>freeze</button>
            </td>
          </tr>
        ))}
        { /* [[start:component]] */ }
      </tbody>
        { /* [[end:binding]] */ }
    </table>
  )
}
// [[end:component]]
