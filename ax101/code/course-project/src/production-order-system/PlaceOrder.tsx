import { usePond } from '@actyx-contrib/react-pond'
import * as React from 'react'
import * as uuid from 'uuid'
import { ProductionOrdersFish } from '../fish/productionOrdersFish'

export const PlaceOrder = (): JSX.Element => {
  const [customer, setCustomer] = React.useState('')
  const [amount, setAmount] = React.useState(0)
  const [article, setArticle] = React.useState('')
  const [machineId, setMachineId] = React.useState('')

  const pond = usePond()

  const createOrder = () => {
    if (machineId && customer && article && amount) {
      ProductionOrdersFish.emitProductionOrderCreatedEvent(
        pond,
        uuid.v1().substr(0, 8),
        machineId,
        customer,
        article,
        amount,
      )
      setCustomer('')
      setAmount(0)
      setArticle('')
      setMachineId('')
    }
  }

  return (
    <div className="card bg-light">
      <div className="card-header">Place new production order</div>
      <div className="card-body">
        <div className="input-group mb-3">
          <span className="input-group-text">Customer</span>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setCustomer(e.target.value)}
            value={customer}
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">Article</span>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setArticle(e.target.value)}
            value={article}
          />
        </div>
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
        <div className="input-group mb-3">
          <span className="input-group-text">Machine</span>
          <select
            className="form-select"
            value={machineId}
            onChange={(e) => setMachineId(e.target.value)}
          >
            <option selected>Choose...</option>
            <option value="machine1">Machine 1</option>
            <option value="machine2">Machine 2</option>
            <option value="machine3">Machine 3</option>
          </select>
        </div>
        <div className="text-end">
          <button className="btn btn-primary" onClick={createOrder}>
            Create production order
          </button>
        </div>
      </div>
    </div>
  )
}
