import { sql } from '@databases/pg'
import db from './db'

export async function list() {
  try {
    const data = await Tenants.list()
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
    const data = await Tenants.byId({ id })
    return { data }
  } catch (e) {
    // @todo: dont expose internal errors
    return { error: e.message }
  }
}

const Tenants = {
  list({ limit = 10, orderBy = 'last_name, first_name' } = {}) {
    const _orderBy = sql`${orderBy}`
    return db.query(
      sql`select * from tenants where deleted_at is null order by ${_orderBy} limit ${limit};`
    )
  },

  async byId({ id }: { id: number }) {
    const result = await db.query(
      sql`select * from tenants where id=${id} limit 1;`
    )
    return result.length ? result[0] : null
  },
}
