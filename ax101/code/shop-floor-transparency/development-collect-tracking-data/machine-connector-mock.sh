[[start:run-connector]]
$ npm run node:machine-mock:start

> course-project@1.0.0 node:machine-mock:start /Users/wwerner/Projects/actyx/Academy-Data/ax101/code/course-project
> nodemon --watch src/machine-mock --exec ts-node src/machine-mock/index.ts

[nodemon] 2.0.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/machine-mock/**/*
[nodemon] watching extensions: ts,json
[nodemon] starting `ts-node src/machine-mock/index.ts`
Emitting {"eventType":"machine_state_changed","device":"Mock Machine","state":0,"stateDesc":"IDLE"}
Emitting {"eventType":"machine_state_changed","device":"Mock Machine","state":0,"stateDesc":"IDLE"}
Emitting {"eventType":"machine_state_changed","device":"Mock Machine","state":1,"stateDesc":"RUNNING"}
Emitting {"eventType":"machine_state_changed","device":"Mock Machine","state":1,"stateDesc":"RUNNING"}
Emitting {"eventType":"machine_state_changed","device":"Mock Machine","state":1,"stateDesc":"RUNNING"}
Emitting {"eventType":"machine_state_changed","device":"Mock Machine","state":0,"stateDesc":"IDLE"}
Emitting {"eventType":"machine_state_changed","device":"Mock Machine","state":1,"stateDesc":"RUNNING"}
Emitting {"eventType":"machine_state_changed","device":"Mock Machine","state":0,"stateDesc":"IDLE"}
Emitting {"eventType":"machine_state_changed","device":"Mock Machine","state":1,"stateDesc":"RUNNING"}
Emitting {"eventType":"machine_state_changed","device":"Mock Machine","state":1,"stateDesc":"RUNNING"}
Emitting {"eventType":"machine_state_changed","device":"Mock Machine","state":1,"stateDesc":"RUNNING"}
Emitting {"eventType":"machine_state_changed","device":"Mock Machine","state":0,"stateDesc":"IDLE"}
Emitting {"eventType":"machine_state_changed","device":"Mock Machine","state":1,"stateDesc":"RUNNING"}
Emitting {"eventType":"machine_state_changed","device":"Mock Machine","state":2,"stateDesc":"ERROR"}
[[end:run-connector]]