import { Pond } from '@actyx/pond'
import { ProductionOrdersFish } from '../fish/productionOrdersFish'

Pond.default().then((pond) => {
    process.stdin.on('data', (data) => {
        const [cmd, ...value] = data.toString().trim().split(' ')

        switch (cmd) {
            case 'create': {
                const id = value[0]
                const amount = +value[1]
                ProductionOrdersFish.emitProductionOrderCreatedEvent(
                    pond,
                    id,
                    'machine 1',
                    'some',
                    amount,
                )
                break
            }
            case 'start': {
                const id = value[0]
                ProductionOrdersFish.emitProductionOrderStartedEvent(pond, id, 'machine 1')
                break
            }
            case 'stop': {
                const id = value[0]
                ProductionOrdersFish.emitProductionOrderFinishedEvent(pond, id, 'machine 1')
                break
            }
            default:
                console.log('Command not found')
                break
        }
    })
})
