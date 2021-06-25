// [[start:structure]]
import { Pond } from '@actyx/pond'
// [[end:structure]]
// npm i mqtt
// [[start:connect-mqtt]]
import * as mqtt from 'mqtt'
// [[end:connect-mqtt]]
// [[start:handle-mqtt-message]]
import { BatchNumberScannerFishes } from '../fish/batchNumberScannerFish'
// [[end:handle-mqtt-message]]

// [[start:connect-mqtt]]
// [[start:structure]]
Pond.default().then((pond) => {
  // [[end:connect-mqtt]]
  const machineId = 'machine1'
  // [[end:structure]]

  // [[start:handle-mqtt-message]]
  const handleMqttMessage = (_topic: string, msg: Buffer) => {
    const data = JSON.parse(msg.toString())
    switch (data.event) {
      case 'scanned':
        BatchNumberScannerFishes.emitInputMaterialBatchScanned(pond, data.value, machineId)
        break
      case 'lost':
        BatchNumberScannerFishes.emitInputMaterialBatchLost(pond, machineId)
    }
  }
  // [[end:handle-mqtt-message]]

  // start simulation with
  // npx @actyx-contrib/actyx-tutorial-simulator ax101-3-scanner --port 1885
  // [[start:connect-mqtt]]
  const mqttClient = mqtt.connect('mqtt://localhost:1885')
  mqttClient.on('connect', () => {
    console.log('mqtt connection established')
    mqttClient.subscribe('scan', () => {
      console.log('mqtt subscription on "scan" established')
      // [[end:connect-mqtt]]
      // [[start:handle-mqtt-message]]
      mqttClient.on('message', handleMqttMessage)
      // [[end:handle-mqtt-message]]
      // [[start:connect-mqtt]]
    })
  })
  // [[start:structure]]
})
// [[end:connect-mqtt]]
// [[end:structure]]