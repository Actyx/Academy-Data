// [[start:current-batch-component]]
import * as React from 'react'
import { useFishFn } from '@actyx-contrib/react-pond'
import { BatchNumberScannerFishes } from '../fish/batchNumberScannerFish'
import { MaterialBatch } from './MaterialBatch'

type CurrentBatchProps = {
  machineId: string
}

export const CurrentBatch = ({ machineId }: CurrentBatchProps): JSX.Element => {
  // [[end:current-batch-component]]
  // [[start:batch-no]]
  const scan = useFishFn(BatchNumberScannerFishes.of, machineId)
  // [[end:batch-no]]

  //[[start:current-batch-component]]
  return (
    <div className="card bg-light">
      <div className="card-header">Input material batch scanner</div>
      {/* [[start:batch-no]] */}
      <div className="card-body">
        {/* [[end:current-batch-component]] */}
        {(scan && scan.state.state === 'engaged' && (
          <MaterialBatch batchId={scan.state.value} />
        )) || <div>Nothing scanned</div>}
        {/* [[start:current-batch-component]] */}
      </div>
      {/* [[end:batch-no]] */}
    </div>
  )
}
// [[end:current-batch-component]]
