import { ActyxEvent, OffsetMap } from "@actyx/pond"
import { MachineStateChangedEvent } from "../fish/events"
// [[start:db-refactoring]]
import { Client } from "pg"

export type DbSettings = {
    host: string,
    port: number,
    user: string,
    password: string,
    database: string,
}

// [[start:init-db]]
export const initDb = async (settings: DbSettings): Promise<Client> => {
    // [[end:db-refactoring]]
    const { host, port, database, password, user } = settings
    const client = new Client({
        host,
        database,
        port,
        password,
        user,
    })
    await client.connect()

    await client.query(
        `CREATE TABLE IF NOT EXISTS public.offset_map (
            id integer NOT NULL,
            offset_map text NOT NULL,
            CONSTRAINT offset_map_pkey PRIMARY KEY (id)
            )`,
    )
    await client.query(
        `CREATE TABLE IF NOT EXISTS public.machine_state_change
      (
      (
            id character varying(40) NOT NULL,
            time timestamp with time zone NOT NULL,
            device character varying(100) NOT NULL,
            new_state integer NOT NULL,
            new_state_desc character varying(100),
            CONSTRAINT machine_state_change_pkey PRIMARY KEY (id)
            )`,
    )

    return client
    // [[start:db-refactoring]]
}
// [[end:init-db]]
// [[end:db-refactoring]]

// [[start:update-db]]
export const updateDb = async (
    pg: Client,
    eventChunk: ActyxEvent<MachineStateChangedEvent>[],
    lowerBound: OffsetMap,
): Promise<void> => {
    await insertStateEvent(pg, eventChunk)
    await storeOffsetMap(pg, lowerBound)
}
// [[end:update-db]]


// [[start:store-offsets]]
export const storeOffsetMap = async (client: Client, offsetMap: OffsetMap): Promise<void> => {
    await client.query(
        // for convenience, we simply store the OffsetMap JSON into one DB field
        'INSERT INTO public.offset_map (id, offset_map) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET offset_map = EXCLUDED.offset_map',
        [1, JSON.stringify(offsetMap)],
    )
        .catch((err) => console.error(err.stack, offsetMap))
}
// [[end:store-offsets]]

// [[start:get-offsets]]
export const loadOffsetMap = async (client: Client): Promise<OffsetMap> => {
    const res = await client.query<{ offsetMap: string }>(
        `SELECT offset_map FROM public.offset_map WHERE id=1`,
    )
    if (res.rowCount > 0 && res.rows[0].offsetMap) {
        return JSON.parse(res.rows[0].offsetMap)
    } else {
        console.warn('Could not deserialize OffsetMap from database. That is ok, if the application has not yet pushed events to the DB.')
        return {}
    }
}
// [[end:get-offsets]]

// [[start:insert-event]]
export const insertStateEvent = async (
    client: Client,
    events: ReadonlyArray<ActyxEvent<MachineStateChangedEvent>>,
): Promise<void> => {
    if (events.length === 0) {
        return
    }
    const values = events
        .map(({ payload, meta }) => {
            const id = meta.eventId.padStart(24, '0')
            return `(
            '${id}', 
            TO_TIMESTAMP(${Math.floor(meta.timestampMicros / 1e6)}), 
            '${payload.device}', 
            '${payload.state}', 
            '${payload.stateDesc || ' '}'
          )`
        })
        .join(',')

    await client
        .query(
            `INSERT INTO public.machine_state_change (id, time, device, new_state, new_state_desc)
        VALUES ${values}
        ON CONFLICT (id) DO NOTHING`,
        )
        .catch((err) => console.error(err.stack, events.length))
}
  // [[end:insert-event]]