import { useRegistryFish } from '@actyx-contrib/react-pond'
import { MaterialBatchFishes, DefinedState } from '../../fish/materialBatchFish'

export type BatchData = Array<{
  batchId: string
  batchSize: number
  availableMaterial: number
  machines: string[]
  orders: string[]
}>

export const batchData = (): BatchData => {
  const materialBatches = useRegistryFish(
    MaterialBatchFishes.all,
    Object.keys,
    MaterialBatchFishes.of,
  )

  return materialBatches
    .map((batch) => batch.state)
    .filter((batch): batch is DefinedState => batch.state === 'defined')
    .map(({ batchId, batchSize, availableMaterial, consumedByMachine, consumedByOrder }) => ({
      batchId,
      batchSize,
      availableMaterial,
      machines: Object.keys(consumedByMachine),
      orders: Object.keys(consumedByOrder),
    }))
}
