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
  eventType: 'machine_state_changed',  // fixed event type
  device: string,                     // name of the machine
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
      state: newState === MachineState.ERROR ? Math.floor(Math.random() * 10) + 11 : newState,
      stateDesc: MachineState[newState]
    }
    console.debug(`Emitting ${JSON.stringify(changeEvent)}`)

    pond.emit(
      Tags('Machine', 'Machine:Mock-1', 'Machine.state', `Machine.state:${newState}`),
      changeEvent
    )

  }, 10_000)
})
  // [[end:impl]]
