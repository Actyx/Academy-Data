// [[start:PartsProducedBadEvent]]
type PartsProducedBadEvent = {
  amount: number
}
// [[end:PartsProducedBadEvent]]

// [[start:PartsProducedEvent]]
type PartsProducedEvent = {
  eventType: 'partsProduced'
  machineId: string
  currentOrderId: string
  partType: string
  amount: number
}
// [[end:PartsProducedEvent]]

const event_1: PartsProducedEvent = {
  // [[start:PartsProducedData]]
  eventType: 'partsProduced',
  machineId: 'press_5000',
  currentOrderId: 'o163653',
  partType: 'front door',
  amount: 42,
  // [[end:PartsProducedData]]
}

// [[start:UnifiedEventIdentifier]]
function onEvent(event) {
  switch (event.eventType) {
    case 'partsProduced':
    // Do something
    case 'machineStopped':
    // Do something else
  }
}
// [[end:UnifiedEventIdentifier]]
