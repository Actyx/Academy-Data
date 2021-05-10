# [[start:start-mock-machine]]
[nodemon] 2.0.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/machine-mock/**/*
[nodemon] watching extensions: ts,json
[nodemon] starting `ts-node src/machine-mock/index.ts`
Emitting {"eventType":"machine_state_changed","device":"Mock Machine","state":1,"stateDesc":"RUNNING"}
Emitting {"eventType":"machine_state_changed","device":"Mock Machine","state":11,"stateDesc":"ERROR"}
Emitting {"eventType":"machine_state_changed","device":"Mock Machine","state":1,"stateDesc":"RUNNING"}
Emitting {"eventType":"machine_state_changed","device":"Mock Machine","state":1,"stateDesc":"RUNNING"}
# [[end:start-mock-machine]]


# [[start:start-db-exporter]]
[nodemon] 2.0.7
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/db-exporter/**/*
[nodemon] watching extensions: ts,json
[nodemon] starting `ts-node src/db-exporter/index.ts`
init PostgreSQL connection
[ { tablename: 'offset_map' }, { tablename: 'machine_state_change' } ]
PostgreSQL connected
Could not deserialize OffsetMap from database. That is ok, if the application has not yet pushed events to the DB.
DB-Exporter started
Starting export from  { lowerBound: {} }
Exporting 9 events.
Starting export from  { lowerBound: { '9VXqr9PKU2e': 8 } }
Exporting 1 events.
Starting export from  { lowerBound: { '9VXqr9PKU2e': 9 } }
Starting export from  { lowerBound: { '9VXqr9PKU2e': 9 } }
Exporting 1 events.
Starting export from  { lowerBound: { '9VXqr9PKU2e': 10 } }
Starting export from  { lowerBound: { '9VXqr9PKU2e': 10 } }
Exporting 1 events.
# [[end:start-db-exporter]]