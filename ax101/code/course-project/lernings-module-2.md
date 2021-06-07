learnings:

## Fish

### State

- how to define simple stage states
- values in state could be an object
- connect to fish

### Events

- same as before, but now it is in a fish
- emitter functions

### Tags

- tags with event annotation
- tags with scope and reasonable naming for foreign-keys
- withId

### Fish

- Structure you fish and Expose it as unit
  - tags
  - fish definitions
  - emitters
- singleton-Fish
- entity fish
- onEventFunction
- where - with `.or()`
- fishId
- working with simple states
- last writer wins (array even if there should be just on value)

## UI apps

### app 1 production-order-system

- create project
- structure of code
- root.tsx - `<Pond>` + import bootstrap-5.0.1
- create components without params
- create basic UI with input-fields and a button
- publish event with usePond() and emitter in fish
- useFish() for singleton and work with state
- create table with key={}

### app 2 machine-terminal

- create components with params
- useFishFn for entity fish + hydration delay (fish = undefined)
- create action in table in reference to row entity (orderId)
- run multiple UIs at the same time, and they interact magically

user extra ui work

- rework the machineId to an input-field
