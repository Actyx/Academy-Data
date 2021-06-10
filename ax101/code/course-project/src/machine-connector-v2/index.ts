// [[start:mqtt-start]]
import { Pond } from '@actyx/pond'
// [[end:mqtt-start]]
// [[start:get-assigned-orders]]
// npm i @actyx-contrib/registry
// import { observeRegistry } from '@actyx-contrib/registry'
// [[end:get-assigned-orders]]
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

// [[start:mqtt-start]]
Pond.default().then((pond) => {
    const machineId = 'machine 1'
    // [[end:mqtt-start]]

    // [[start:use-registry-fish]]
    let currentOrderId: string | undefined = undefined

    let lastOrders: ProductionOrdersState = { orders: {} }
    let lastAssignedOrders: string[] = []
    let currentBatchId: string | undefined = undefined

    pond.observe(ProductionOrdersFish.openAssignedToMachine(machineId), (state) =>
        handleStateChanged(lastOrders, Object.keys(state)),
    )
    pond.observe(ProductionOrdersFish.all, (state) => handleStateChanged(state, lastAssignedOrders))

    pond.observe(BatchNumberScannerFishes.of(machineId), (state) => {
        if (state.state === 'engaged') {
            console.log('scanner scanned', state.value)
            currentBatchId = state.value
        } else {
            currentBatchId = undefined
            console.log('scanner free')
        }
    })

    const handleStateChanged = (orders: ProductionOrdersState, assignedOrders: string[]) => {
        const activeOrderIds = assignedOrders.filter(
            (orderId) => orders.orders[orderId]?.state === 'started',
        )
        if (activeOrderIds.length === 0) {
            if (currentOrderId) {
                console.log('Stop current production order.')
                mqttClient.publish('commands', JSON.stringify({ command: 'stop' }))
                currentOrderId = undefined
            } else {
                console.log('Nothing to do')
            }
        } else if (currentOrderId === undefined || !activeOrderIds.includes(currentOrderId)) {
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
        } else {
            const order = orders.orders[currentOrderId]
            const rest = order.amount - sum(order.consumedMaterial)
            if (rest <= 0) {
                console.log('ProductionOrderFinished', order.orderId)
                ProductionOrdersFish.emitProductionOrderFinishedEvent(
                    pond,
                    order.orderId,
                    machineId,
                )
            } else {
                console.log(`In progress ${order.orderId}, ${rest} parts are missing`)
            }
        }

        lastOrders = orders
        lastAssignedOrders = assignedOrders
    }
    // [[end:use-registry-fish]]

    // [[start:handle-mqtt-message]]
    const handleMaterialMqttMessage = (msg: Buffer) => {
        const data = JSON.parse(msg.toString())
        if (data.event === 'material-consumed') {
            // use io-ts from module 1
            if (currentBatchId && currentOrderId) {
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
    // npx @actyx-contrib/actyx-tutorial-simulator ax101-3-machine --port 1885
    // [[start:mqtt-start]]
    const mqttClient = mqtt.connect('mqtt://localhost:1885')
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
