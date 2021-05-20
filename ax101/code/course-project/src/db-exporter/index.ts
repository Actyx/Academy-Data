// [[start:scaffold]]
import { Pond } from '@actyx/pond'
import { Client } from 'pg'
// [[end:scaffold]]

// [[start:settings]]
const settings = {
  db: {
    host: '127.0.0.1',
    port: 5432,
    user: 'actyx',
    password: 'changeit',
    database: 'dashboard',
  },
}
export type Settings = typeof settings
// [[end:settings]]

// [[start:scaffold]]
const exitApp = () => process.exit(6) // exit with arbitrary error code 6
// [[end:scaffold]]

// [[start:scaffold]]
// [[start:init-db]]
const main = async () => {
  // [[end:init-db]]
  // [[end:scaffold]]
  const pond = await Pond.default()
  // [[start:init-db]]
  console.info('init PostgreSQL connection')
  const db = await initDb(settings.db)
  const tablesResult = await db.query("SELECT tablename FROM pg_catalog.pg_tables where schemaname = 'public'")
  console.debug(tablesResult.rows)
  console.info('PostgreSQL connected')
  // [[end:init-db]]

  console.debug(pond.info())

  // [[start:scaffold]]
  // [[start:init-db]]
}
// [[end:init-db]]
// [[end:scaffold]]

// [[start:scaffold]]
main().catch((e: unknown) => {
  console.log(e)
  exitApp()
})
// [[end:scaffold]]


// [[start:init-db]]
export const initDb = async (settings: Settings['db']): Promise<Client> => {
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
          id character varying(40) NOT NULL,
          time timestamp with time zone NOT NULL,
          device character varying(100) NOT NULL,
          new_state integer NOT NULL,
          new_state_desc character varying(100),
          CONSTRAINT machine_state_change_pkey PRIMARY KEY (id)
          )`,
  )

  return client
}
// [[end:init-db]]
