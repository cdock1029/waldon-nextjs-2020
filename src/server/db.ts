import knex from 'knex'
import { types } from 'pg'
import { builtins } from 'pg-types'

types.setTypeParser(builtins.TIMESTAMP, (val) => {
  return val
})

let globalAny: any = global

globalAny.db =
  globalAny.db ||
  knex({
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: { min: 1, max: 5 },
  })

export const db: knex = globalAny.db
