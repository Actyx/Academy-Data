import { Fish, FishId, PendingEmission, Pond, Tag } from '@actyx/pond'
import { InputMaterialConsumedEvent } from './materialBatchFish'

// HINT:
// now we split up the state = 'placed' | 'started' | 'finished', and add additional properties to each state, generated over the livetime of the production order

// Hint: add unknown. explained like a SQL request without any result. Query fish with unknown Id is valid but returns an Undefined/Unknown state
type UnknownState = {
    orderId: string
    state: 'unknown'
}

type IdleState = {
    orderId: string
    state: 'placed'
    machineId: string
    article: string
    amount: number
}

type StartedState = {
    orderId: string
    state: 'started'
    startTimestampMicros: number
    machineId: string
    article: string
    amount: number
    consumedMaterial: Record<string, number>
}

type FinishedState = {
    orderId: string
    state: 'finished'
    startTimestampMicros: number
    finishedTimestampMicros: number
    machineId: string
    article: string
    amount: number
    consumedMaterial: Record<string, number>
}

export type ProductionOrderState = UnknownState | IdleState | StartedState | FinishedState

// [[start:move-event-to-new-Fish]]
export type ProductionOrderCreatedEvent = {
    eventType: 'productionOrderCreated'
    orderId: string
    machineId: string
    article: string
    amount: number
}

export type ProductionOrderStartedEvent = {
    eventType: 'productionOrderStarted'
    orderId: string
    machineId: string
}

export type ProductionOrderFinishedEvent = {
    eventType: 'productionOrderFinished'
    orderId: string
    machineId: string
}

type ProductionOrderEvent =
    | ProductionOrderCreatedEvent
    | ProductionOrderStartedEvent
    | ProductionOrderFinishedEvent
// [[end:move-event-to-new-Fish]]

// [[start:use-same-tags-as-before]]
// HINT:
// to be compatible we use the same tags.
const productionOrderTag = Tag<ProductionOrderEvent | InputMaterialConsumedEvent>('ProductionOrder')
const productionOrderCreatedTag = Tag<ProductionOrderCreatedEvent>('ProductionOrder.created')
const productionOrderStartedByTag = Tag<ProductionOrderStartedEvent>('ProductionOrder.startedBy')
const productionOrderFinishedByTag = Tag<ProductionOrderFinishedEvent>('ProductionOrder.finishedBy')
// [[end:use-same-tags-as-before]]

// [[start:copy-existing-emitters]]
export const emitProductionOrderCreatedEvent = (
    pond: Pond,
    orderId: string,
    machineId: string,
    article: string,
    amount: number,
): PendingEmission =>
    pond.emit(productionOrderTag.withId(orderId).and(productionOrderCreatedTag), {
        eventType: 'productionOrderCreated',
        orderId,
        machineId,
        article,
        amount,
    })

export const emitProductionOrderStartedEvent = (
    pond: Pond,
    orderId: string,
    machineId: string,
): PendingEmission =>
    pond.emit(
        productionOrderTag.withId(orderId).and(productionOrderStartedByTag.withId(machineId)),
        {
            eventType: 'productionOrderStarted',
            orderId,
            machineId,
        },
    )

export const emitProductionOrderFinishedEvent = (
    pond: Pond,
    orderId: string,
    machineId: string,
): PendingEmission =>
    pond.emit(
        productionOrderTag.withId(orderId).and(productionOrderFinishedByTag.withId(machineId)),
        {
            eventType: 'productionOrderFinished',
            orderId,
            machineId,
        },
    )
// [[end:copy-existing-emitters]]

export const ProductionOrderFishes = {
    tags: {
        productionOrderTag,
        productionOrderCreatedTag,
        productionOrderStartedByTag,
        productionOrderFinishedByTag,
    },
    of: (
        orderId: string,
    ): Fish<ProductionOrderState, ProductionOrderEvent | InputMaterialConsumedEvent> => ({
        fishId: FishId.of('ProductionOrder', orderId, 0),
        initialState: {
            state: 'unknown',
            orderId,
        },
        where: productionOrderTag.withId(orderId),
        onEvent: (state, event, metadata) => {
            switch (event.eventType) {
                case 'productionOrderCreated':
                    if (state.state === 'unknown') {
                        return {
                            orderId: event.orderId,
                            state: 'placed',
                            machineId: event.machineId,
                            amount: event.amount,
                            article: event.article,
                        }
                    } else {
                        state.machineId = event.machineId
                        state.amount = event.amount
                        state.article = event.article
                        return state
                    }

                case 'productionOrderStarted':
                    if (state.state === 'unknown') {
                        return {
                            orderId: event.orderId,
                            state: 'started',
                            machineId: event.machineId,
                            amount: -1,
                            article: 'unknown',
                            startTimestampMicros: metadata.timestampMicros,
                            consumedMaterial: {},
                        }
                    } else {
                        return {
                            ...state,
                            state: 'started',
                            startTimestampMicros: metadata.timestampMicros,
                            consumedMaterial: {},
                        }
                    }

                case 'productionOrderFinished':
                    if (state.state === 'started') {
                        return {
                            ...state,
                            state: 'finished',
                            finishedTimestampMicros: metadata.timestampMicros,
                        }
                    } else {
                        return {
                            orderId: event.orderId,
                            state: 'finished',
                            machineId: event.machineId,
                            startTimestampMicros: 0,
                            finishedTimestampMicros: metadata.timestampMicros,
                            consumedMaterial: {},
                            amount: -1,
                            article: 'unknown',
                        }
                    }
                case 'inputMaterialConsumed':
                    if (state.state === 'started' || state.state === 'finished') {
                        // get the last value. If undefined, the values is 0
                        const lastValue = state.consumedMaterial[event.batchId] || 0
                        state.consumedMaterial[event.batchId] = lastValue + 1
                        return state
                    } else {
                        return {
                            orderId: event.orderId,
                            state: 'started',
                            machineId: event.device,
                            startTimestampMicros: metadata.timestampMicros,
                            consumedMaterial: {
                                [event.batchId]: 1,
                            },
                            amount: -1,
                            article: 'unknown',
                        }
                    }
                default:
                    break
            }
            // [[start:fish-skeleton]]
            return state
        },
    }),

    all: {
        fishId: FishId.of('ProductionOrders', 'all', 0),
        initialState: {}, // initial state with no known production order id
        where: productionOrderCreatedTag,
        onEvent: (state, event) => {
            switch (event.eventType) {
                case 'productionOrderCreated':
                    state[event.orderId] = true
                    return state
            }
            return state
        },
    } as Fish<Record<string, boolean>, ProductionOrderEvent>,

    openAssignedToMachine: (
        machineId: string,
    ): Fish<Record<string, boolean>, ProductionOrderEvent | ProductionOrderFinishedEvent> => ({
        fishId: FishId.of('ProductionOrders', 'all', 0),
        initialState: {}, // initial state with no known production order id
        where: productionOrderCreatedTag.or(productionOrderFinishedByTag.withId(machineId)),
        onEvent: (state, event) => {
            switch (event.eventType) {
                case 'productionOrderCreated':
                    state[event.orderId] = true
                    return state
            }
            return state
        },
    }),
    // [[end:fish-skeleton]]
    emitProductionOrderCreatedEvent,
    emitProductionOrderStartedEvent,
    emitProductionOrderFinishedEvent,
    // [[end:emitters]]
}
