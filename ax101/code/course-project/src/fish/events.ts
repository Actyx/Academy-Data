// [[start:machine-state-event]]
export type MachineStateChangedEvent = {
    eventType: 'machine_state_changed',  // fixed event type
    device: string,                     // name of the machine
    state: number,                      // state code
    stateDesc?: string,                 // state name
  }
// [[end:machine-state-event]]