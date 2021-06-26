// [[start:mqtt-start]]
import { Pond } from '@actyx/pond'
// [[end:mqtt-start]]
// [[start:mqtt-start]]
import * as mqtt from 'mqtt'
// [[end:mqtt-start]]
// [[start:handle-mqtt-message]]
import { BatchNumberScannerFishes } from '../fish/batchNumberScannerFish'
import { ProductionOrdersFish, ProductionOrdersState } from '../fish/productionOrdersFish'
import { MaterialBatchFishes } from '../fish/materialBatchFish'
// [[end:handle-mqtt-message]]

// 1. mqtt-start  --  same mqtt-wrapper as scanner connector (wuhu we have found a pattern)
// 2. handle-mqtt-message -- with different topics
// 3. observe-batch-number-scanner
// 4. observe-openAssignedToMachine-and-all
// 5. map-fish-state-to-machine-control-structure

// [[start:mqtt-start]]
Pond.default().then((pond) => {
  const machineId = 'machine1'
  // [[end:mqtt-start]]

  // [[start:observe-batch-number-scanner]]
  let currentBatchId: string | undefined = undefined
  // observe batch number scanner to get the current state
  pond.observe(BatchNumberScannerFishes.of(machineId), (state) => {
    currentBatchId = state.state === 'engaged' ? state.value : undefined
    console.log('Current batchId', currentBatchId)
  })
  // [[end:observe-batch-number-scanner]]

  // [[start:observe-openAssignedToMachine-and-all]]
  // observe assigned Machines
  let lastAssignedOrders: string[] = []
  pond.observe(ProductionOrdersFish.openAssignedToMachine(machineId), (state) =>
    handleStateChanged(lastOrders, Object.keys(state)),
  )

  // observe all production orders
  let lastOrders: ProductionOrdersState = { orders: {} }
  pond.observe(ProductionOrdersFish.all, (state) => handleStateChanged(state, lastAssignedOrders))
  // [[end:observe-openAssignedToMachine-and-all]]

  // [[start:handle-no-active-order]]
  const handleNoActiveOrder = () => {
    if (currentOrderId) {
      console.log('Stop current production order.')
      mqttClient.publish('commands', JSON.stringify({ command: 'stop' }))
      currentOrderId = undefined
    } else {
      console.log('Nothing to do')
    }
  }
  // [[end:handle-no-active-order]]

  // [[start:handle-start-or-switch-order]]
  const handleStartOrSwitchOrder = (orders: ProductionOrdersState, activeOrderIds: string[]) => {
    if (currentOrderId && !activeOrderIds.includes(currentOrderId)) {
      console.log('Switch to new task. Old task is stopped')
      mqttClient.publish('commands', JSON.stringify({ command: 'stop' }))
    }

    const firstActiveOrderIds = activeOrderIds[0]
    const order = orders.orders[firstActiveOrderIds]
    const missing = order.amount - sum(order.consumedMaterial)

    console.log('Start new task.', firstActiveOrderIds)
    mqttClient.publish(
      'commands',
      JSON.stringify({ command: 'start', partsToProduce: Math.max(0, missing) }),
    )
    currentOrderId = firstActiveOrderIds
  }
  // [[end:handle-start-or-switch-order]]

  // [[start:handle-order-during-production]]
  const handleOrderDuringProduction = (orders: ProductionOrdersState, currentOrderId: string) => {
    const order = orders.orders[currentOrderId]
    const rest = order.amount - sum(order.consumedMaterial)
    if (rest <= 0) {
      console.log('ProductionOrderFinished', order.orderId)
      ProductionOrdersFish.emitProductionOrderFinishedEvent(pond, order.orderId, machineId)
    } else {
      console.log(`In progress ${order.orderId}, ${rest} parts are missing`)
    }
  }
  // [[end:handle-order-during-production]]

  // [[start:map-fish-state-to-machine-control-structure]]
  let currentOrderId: string | undefined = undefined
  const handleStateChanged = (orders: ProductionOrdersState, assignedOrders: string[]) => {
    const activeOrderIds = assignedOrders.filter(
      (orderId) => orders.orders[orderId]?.state === 'started',
    )
    if (activeOrderIds.length === 0) {
      // no active production order, stop current or do nothing
      handleNoActiveOrder()
    } else if (currentOrderId === undefined || !activeOrderIds.includes(currentOrderId)) {
      // start new or switch to new production order
      handleStartOrSwitchOrder(orders, activeOrderIds)
    } else {
      // handle events during production
      handleOrderDuringProduction(orders, currentOrderId)
    }

    lastOrders = orders
    lastAssignedOrders = assignedOrders
  }
  // [[end:map-fish-state-to-machine-control-structure]]

  // [[start:handle-mqtt-message]]
  const handleMaterialMqttMessage = (msg: Buffer) => {
    const data = JSON.parse(msg.toString())
    if (data.event === 'material-consumed') {
      // use io-ts from module 1
      if (currentBatchId && currentOrderId) {
        console.debug(
          `machine consumed material ${machineId}, from batch ${currentBatchId} for order ${currentOrderId}`,
        )
        MaterialBatchFishes.emitInputMaterialConsumed(
          pond,
          currentBatchId,
          currentOrderId,
          machineId,
        )
      } else {
        console.error('machine runs without input material or assigned order!')
      }
      // BatchNumberScannerFishes.emitInputMaterialBatchScanned(pond, data.value, machineId)
    }
  }
  const handleErrorMqttMessage = (msg: Buffer) => {
    console.log(msg.toString())
  }
  // [[end:handle-mqtt-message]]

  // start simulation with
  // npx @actyx-contrib/actyx-tutorial-simulator ax101-3-machine --port 1884
  // [[start:mqtt-start]]
  const mqttClient = mqtt.connect('mqtt://localhost:1884')
  mqttClient.on('connect', () => {
    console.log('mqtt connection established')
    mqttClient.subscribe(['material', 'error'], () => {
      console.log('mqtt subscription on "material" and "error" established')
      // [[end:mqtt-start]]
      // [[start:handle-mqtt-message]]
      mqttClient.on('message', (topic, msg) => {
        switch (topic) {
          case 'material':
            handleMaterialMqttMessage(msg)
            break
          case 'error':
            handleErrorMqttMessage(msg)
            break
        }
      })
      // [[end:handle-mqtt-message]]
      // [[start:mqtt-start]]
    })
  })
})
// [[end:mqtt-start]]

const sum = (map: Record<string, number>): number => Object.values(map).reduce((a, b) => a + b, 0)
