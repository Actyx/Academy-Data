// [[start:scaffold]]
import { ActyxEvent, OffsetMap, Pond, Tag } from '@actyx/pond'
import { MachineStateChangedEvent } from '../fish/events'
import { getOffsetMap, initDb, updateDb } from './db'
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
// [[end:settings]]

// [[start:scaffold]]
const exitApp = () => process.exit(6)
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

  let lowerBound = await getOffsetMap(db)

  let queryActive = false

  const bulkInsert = async (lowerBound: OffsetMap): Promise<OffsetMap> => {
    queryActive = true
    const newLowerBound = await pond.events().queryAllKnownChunked(
      {
        lowerBound,
        order: 'Asc',
        query: Tag('Machine.state'),
      },
      100,
      async (chunk) => {
        console.info('add events:', { lng: chunk.events.length })
        const events = chunk.events.filter(e => {
          console.log(e)
          return true
        })
        await updateDb(db, events as ActyxEvent<MachineStateChangedEvent>[], chunk.upperBound)
      },
    )
    queryActive = false
    return newLowerBound
  }

  // trigger a new export after 5 Seconds
  setInterval(() => {
    if (queryActive === false) {
      console.debug('start next export run', { lowerBound })
      bulkInsert(lowerBound)
        .then((bound) => (lowerBound = bound))
        .catch((e: unknown) => {
          console.error(`restart app after an exception in bulkInsert`, e)
          exitApp()
        })
    } else {
      console.warn('blocked by backpressure')
    }
  }, 5000)
  console.info('DB-Exporter started')
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


    