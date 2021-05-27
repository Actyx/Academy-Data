// [[start:imports]]
import { Pond, Tag } from '@actyx/pond'
import {
  AttributeIds,
  ClientMonitoredItem,
  ClientSubscription,
  DataValue,
  MessageSecurityMode,
  MonitoringParametersOptions,
  OPCUAClient,
  SecurityPolicy,
  TimestampsToReturn,
  UserTokenType
} from 'node-opcua';
import { MachineStateChangedEvent } from '../fish/events';
// [[end:imports]]

// [[start:main-harness]]
Pond.default().then(async (pond) => {
  // [[end:main-harness]]

  // [[start:client]]
  // create & configure OPC UA client
  const connectionStrategy = {
    initialDelay: 1000, // wait 1s before trying to connect
    maxRetry: 1         // only retry once to reconnect
  }

  const client = OPCUAClient.create({
    applicationName: "ActyxOpcuaConnector",
    connectionStrategy: connectionStrategy,
    securityMode: MessageSecurityMode.None,
    securityPolicy: SecurityPolicy.None,
    endpoint_must_exist: false,
  });
  await client.connect("opc.tcp://localhost:4434"); // OPC UA server from machine-mock/opcua.ts
  // [[end:client]]

  // [[start:session]]
  // establish session
  const session = await client.createSession({
    type: UserTokenType.UserName,
    userName: 'actyx',
    password: 'actyx',
  });
  console.log("connected !");
  // [[end:session]]

  // [[start:subscription]]
  // create subscription
  const subscription = ClientSubscription.create(session, {
    requestedPublishingInterval: 1000,
    requestedLifetimeCount: 1000,
    requestedMaxKeepAliveCount: 20,
    maxNotificationsPerPublish: 10,
    publishingEnabled: true,
    priority: 10,
  });
  // [[end:subscription]]

  // [[start:monitor]]
  const itemToMonitor = {
    nodeId: 'ns=1;s="machinestate"', // data exposed from machine, see machine-mock/opcua.ts
    attributeId: AttributeIds.Value
  };
  const parameters: MonitoringParametersOptions = {
    samplingInterval: 1000,
    discardOldest: true,
    queueSize: 10
  };
  
  // monitor variable
  const monitoredItem = ClientMonitoredItem.create(
    subscription,
    itemToMonitor,
    parameters,
    TimestampsToReturn.Server
    );
    
    monitoredItem.on("changed", (dataValue: DataValue) => {
      console.log(" value has changed : ", dataValue.value.value);
      // [[end:monitor]]
      // [[start:emission]]
      // emit events
      const machineId = 'Mock-OPCUA'
      const changeEvent: MachineStateChangedEvent = {
        eventType: 'machineStateChanged',
        device: machineId,
        state: dataValue.value.value, // value from opcua
        stateDesc: '' // omit description
      }
      
      const machineTag = Tag<MachineStateChangedEvent>('Machine').withId(machineId)
      const machineStateTag = Tag<MachineStateChangedEvent>('Machine.state').withId(machineId)
      
      console.debug(`Emitting ${JSON.stringify(changeEvent)}`)
      pond.emit(machineTag.and(machineStateTag), changeEvent)
      
      // [[end:emission]]
      // [[start:monitor]]
  });
  // [[end:monitor]]

  console.log(pond.info())
  // [[start:main-harness]]
})
// [[end:main-harness]]