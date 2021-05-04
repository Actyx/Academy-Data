// [[start:import]]
import { Pond, Tags } from '@actyx/pond'
// [[end:import]]

// [[start:states]]
enum MachineState {
  IDLE,
  RUNNING,
  ERROR,
}
// [[end:states]]

// [[start:change-event]]
type MachineStateChangedEvent = {
  eventType: 'machine_state_changed'  // fixed event type
  device: string,                     // name of the machine that changed its state
  state: number,                      // state code
  stateDesc?: string,                 // state name
}
// [[end:change-event]]

// [[start:random]]
function randomMachineState(): MachineState {
  const rand = Math.random()
  if (rand < 0.2) return MachineState.IDLE
  else if (rand < 0.9) return MachineState.RUNNING
  else return MachineState.ERROR
}
// [[end:random]]

// [[start:impl]]
Pond.default().then((pond) => {
  setInterval(() => {
    const newState = randomMachineState()
    const changeEvent: MachineStateChangedEvent = {
      eventType: 'machine_state_changed',
      device: 'Mock Machine',
      state: newState,
      stateDesc: MachineState[newState]
    }
    console.log(`Emitting ${JSON.stringify(changeEvent)}`, pond.info())

    pond.emit(
      Tags('Machine:Mock-1', `Machine.state:${newState}`),
      changeEvent
    )

  }, 1000)
})
  // [[end:impl]]
