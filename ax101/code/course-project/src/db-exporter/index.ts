// [[start:scaffold]]
import { OffsetMap, Pond, Tag, EventsSortOrder } from '@actyx/pond'
import manifest from './manifest'
import { isMachineStateChangedEvent } from '../fish/events'
import { loadOffsetMap, initDb, updateDb } from './db'
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
  const pond = await Pond.default(manifest)
  // [[start:init-db]]
  console.info('init PostgreSQL connection')
  const db = await initDb(settings.db)
  const tablesResult = await db.query("SELECT tablename FROM pg_catalog.pg_tables where schemaname = 'public'")
  console.debug(tablesResult.rows)
  console.info('PostgreSQL connected')
  // [[end:init-db]]


  // [[start:insert-process-state]]
  let lowerBound = await loadOffsetMap(db)
  let queryActive = false
  // [[start:insert-process-state]]

  // [[start:bulk-insert]]
  const bulkInsert = async (lowerBound: OffsetMap): Promise<OffsetMap> => {
    queryActive = true
    const newLowerBound = await new Promise<OffsetMap>((res) => {
      let lastOffsetMap = lowerBound
      pond.events().queryAllKnownChunked(
        {
          lowerBound,
          order: EventsSortOrder.Ascending,
          query: Tag('Machine.state'),
        },
        100,
        async (chunk) => {
          console.info(`Exporting ${chunk.events.length || 0} events.`)
          await updateDb(
            db,
            chunk.events.filter(isMachineStateChangedEvent)
            , chunk.upperBound)
          lastOffsetMap = chunk.upperBound
        },
        () => res(lastOffsetMap)
      )
    })

    queryActive = false
    return newLowerBound
  }
  // [[end:bulk-insert]]

  // [[start:insert-interval]]
  setInterval(() => {
    if (queryActive === false) {
      console.debug('Starting export from ', { lowerBound })
      bulkInsert(lowerBound)
        .then((bound) => (lowerBound = bound))
        .catch((e: unknown) => {
          console.error(`Restarting app after an exception in bulkInsert`, e)
          exitApp()
        })
    } else {
      console.warn('Blocked by back pressure, trying again later.')
    }
  }, 5000)
  // [[end:insert-interval]]
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


