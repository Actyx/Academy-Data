const uuid = { v1: () => '' }

// [[start:machineStateChangedEvent]]
type MachineStateChangedEvent = {
  eventType: 'machineStateChanged'
  device: string
  state: string
}

const stateEvent: MachineStateChangedEvent = {
  eventType: 'machineStateChanged',
  device: 'Machine1',
  state: 'active',
}
// [[end:machineStateChangedEvent]]
// [[start:machineErrorOccurredEvent]]
type MachineErrorOccurredEvent = {
  eventType: 'machineErrorOccurred'
  device: string
  errorId: string
  errorCode: number
  description: string
}

const errorEvent: MachineErrorOccurredEvent = {
  eventType: 'machineErrorOccurred',
  device: 'Machine1',
  errorId: uuid.v1(),
  errorCode: 112,
  description: 'fire',
}
// [[end:machineErrorOccurredEvent]]
