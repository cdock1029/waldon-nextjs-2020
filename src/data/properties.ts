import { sql } from '@databases/pg'
import db from './db'

export async function list() {
  try {
    const data = await Properties.list()
    return { data }
  } catch (e) {
    return { error: e.message }
  }
}

export async function byId(id: number) {
  if (!id) {
    return { error: 'Missing required param: id' }
  }
  try {
    const data = await Properties.byId({ id })
    return { data }
  } catch (e) {
    // @todo: dont expose internal errors
    return { error: e.message }
  }
}

const Properties = {
  list({ limit = 10, orderBy = 'name' } = {}) {
    const _orderBy = sql.ident(orderBy)
    return db.query(
      sql`select * from properties order by ${_orderBy} limit ${limit};`
    )
  },

  async byId({ id }: { id: number }) {
    const result = await db.query(
      sql`select * from properties where id=${id} limit 1;`
    )
    return result.length ? result[0] : null
  },
}
