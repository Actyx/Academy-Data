// [[start:import]]
import { Pond, Tags } from '@actyx/pond'
import { MachineStateChangedEvent } from '../fish/events'
// [[end:import]]

// [[start:states]]
enum MachineState {
  IDLE,
  RUNNING,
  ERROR,
}
// [[end:states]]

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
