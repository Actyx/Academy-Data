import * as React from 'react'
import { useFishFn } from '@actyx-contrib/react-pond'
import { BatchNumberScannerFishes } from '../fish/batchNumberScannerFish'
import { MaterialBatch } from './MaterialBatch'

type CurrentBatchProps = {
  machineId: string
}

export const CurrentBatch = ({ machineId }: CurrentBatchProps): JSX.Element => {
  const scan = useFishFn(BatchNumberScannerFishes.of, machineId)

  return (
    <div className="card bg-light">
      <div className="card-header">Input material batch scanner</div>
      <div className="card-body">
        {(scan && scan.state.state === 'engaged' && (
          <MaterialBatch batchId={scan.state.value} />
        )) || <div>Nothing scanned</div>}
      </div>
    </div>
  )
}
