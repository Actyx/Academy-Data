// [[start:registry]]
import { useRegistryFish } from '@actyx-contrib/react-pond'
import { MaterialBatchFishes, DefinedState } from '../../fish/materialBatchFish'
// [[end:registry]]

// [[start:model]]
export type BatchData = Array<{
  batchId: string
  batchSize: number
  availableMaterial: number
  machines: string[]
  orders: string[]
}>
// [[end:model]]

// [[start:model]]
// [[start:registry]]
// [[start:map]]
export const batchData = (): BatchData => {
  // [[end:map]]
  // [[end:model]]
  const materialBatches = useRegistryFish(
    MaterialBatchFishes.all,
    Object.keys,
    MaterialBatchFishes.of,
  )
  // [[end:registry]]

  // [[start:map]]
  return materialBatches
    .map((batch) => batch.state)
    .filter((batchState): batchState is DefinedState => batchState.state === 'defined')
    .map(({ batchId, batchSize, availableMaterial, consumedByMachine, consumedByOrder }) => ({
      batchId,
      batchSize,
      availableMaterial,
      machines: Object.keys(consumedByMachine),
      orders: Object.keys(consumedByOrder),
    }))
  // [[end:map]]
  // [[start:model]]
  // [[start:registry]]
}
// [[end:registry]]
// [[end:model]]
