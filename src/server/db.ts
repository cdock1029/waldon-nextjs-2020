import pgPromise, { IMain, IDatabase } from 'pg-promise'
import { builtins } from 'pg-types'

let globalAny: {
  pgp: IMain
  db: IDatabase<{}>
} = global as any

globalAny.pgp = (globalAny.pgp as IMain) || pgPromise()

globalAny.pgp.pg.types.setTypeParser(builtins.TIMESTAMP, (val) => {
  return val
})

globalAny.pgp.pg.defaults.max = 3
/*
max: 1,
min: 0,
idleTimeoutMillis: 120000,
connectionTimeoutMillis: 10000
*/

globalAny.db =
  (globalAny.db as IDatabase<{}>) || globalAny.pgp(process.env.DATABASE_URL!)

export const db = globalAny.db
