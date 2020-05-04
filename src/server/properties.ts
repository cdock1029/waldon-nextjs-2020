import { sql } from '@databases/pg'
import db from './db'

export default {
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
