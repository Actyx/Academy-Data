// [[start:skeleton]]
import * as React from 'react'
// [[end:skeleton]]
// [[start:emit-order]]
import * as uuid from 'uuid'
import { usePond } from '@actyx-contrib/react-pond'
import { ProductionOrdersFish } from '../fish/productionOrdersFish'
// [[end:emit-order]]

// [[start:skeleton]]
// [[start:emit-order]]
// [[start:create-action]]
export const OrderForm = (): JSX.Element => {
  // [[end:create-action]]
  // [[end:emit-order]]
  const [amount, setAmount] = React.useState(0)
  const [article, setArticle] = React.useState('')
  const [machineId, setMachineId] = React.useState('')
  // [[end:skeleton]]

  // [[start:emit-order]]
  // [[start:create-action]]
  const pond = usePond()

  const createOrder = () => {
    if (machineId && article && amount) {
      ProductionOrdersFish.emitProductionOrderCreatedEvent(
        pond,
        uuid.v1().substr(0, 8),
        machineId,
        article,
        amount,
      )
      setAmount(0)
      setArticle('')
      setMachineId('')
    }
  }
  // [[end:emit-order]]
  // [[start:skeleton]]
  return (
    <div className="card bg-light">
      <div className="card-body">
        {/* [[end:create-action]] */}
        {/* [[end:skeleton]]  */}
        {/* [[start:article-field]]  */}
        <div className="input-group mb-3">
          <span className="input-group-text">Article</span>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setArticle(e.target.value)}
            value={article}
          />
        </div>
        {/* [[end:article-field]]  */}
        {/* [[start:amount-field]]  */}
        <div className="input-group mb-3">
          <span className="input-group-text">Amount</span>
          <input
            type="number"
            className="form-control"
            min="1"
            onChange={(e) => setAmount(parseInt(e.target.value))}
            value={amount}
          />
        </div>
        {/* [[end:amount-field]]  */}
        {/* [[start:machine-field]]  */}
        <div className="input-group mb-3">
          <span className="input-group-text">Machine</span>
          <select
            className="form-select"
            value={machineId}
            onChange={(e) => setMachineId(e.target.value)}
          >
            <option>Choose...</option>
            <option value="machine1">Machine 1</option>
            <option value="machine2">Machine 2</option>
            <option value="machine3">Machine 3</option>
          </select>
        </div>
        {/* [[end:machine-field]]  */}
        {/* [[start:create-action]]  */}
        <div className="text-end">
          <button className="btn btn-primary" onClick={createOrder}>
            Create production order
          </button>
        </div>
        {/* [[start:skeleton]] */}
      </div>
    </div>
  )
}
// [[end:create-action]]
// [[end:skeleton]]
