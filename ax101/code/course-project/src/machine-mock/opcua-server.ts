// [[start:opcua-imports]]
import { DataType, OPCUAServer, Variant } from 'node-opcua'
// [[end:opcua-imports]]
// [[start:opcua-prng-import]]
import { randomMachineState } from '.'
// [[end:opcua-prng-import]]

// [[start:opcua-server]]
const serverConfig = {
    port: 4434,
    resourcePath: '/UA/actyx/',
    buildInfo: {
        productName: 'Actyx-OPC_UA-MockPlc',
        buildNumber: '1',
        buildDate: new Date(2021, 5, 15),
    },
    allowAnonymous: false,
    userManager: {
        // hard coded authentication credentials for the demo
        isValidUser: (username: string, password: string) => username === 'actyx' && password === 'actyx',
    },
}
const server = new OPCUAServer(serverConfig)
// [[end:opcua-server]]


// [[start:opcua-server-model]]
const setupValues = async (server: OPCUAServer): Promise<() => void> => {
    const addressSpace = server.engine.addressSpace
    if (addressSpace) {
        const namespace = addressSpace.getOwnNamespace()
        const device = namespace.addObject({
            organizedBy: addressSpace.rootFolder.objects,
            browseName: 'mockPlc',
        })
        namespace.addVariable({
            componentOf: device,
            browseName: 'Machine State',
            dataType: 'Int16',
            nodeId: 'ns=1;s="machinestate"',
            value: {
                get: () => new Variant({
                    dataType: DataType.Int16, value: randomMachineState()
                })
            }
        })
    }
    return () => undefined
}
// [[end:opcua-server-model]]

// [[start:opcua-server-start]]
export const startOpcuaServer = async () => {
    await server.initialize()  // configure server properties
    await setupValues(server) // set up data model to be provided

    // start server & set up logging
    server.start(() =>
        console.log(`OPC UA server listening on opc.tcp://localhost:${serverConfig.port}`)
    )
    server.on(
        'session_closed',
        (session) => console.log(`OPC UA session '${session.sessionName}' closed.`))
    server.on(
        'session_activated',
        (session) => console.log(`OPC UA session '${session.sessionName}' activated.`))
}
// [[end:opcua-server-start]]