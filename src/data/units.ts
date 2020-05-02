import { sql } from '@databases/pg'
import db from './db'

export default {
  list({ limit = 10, orderBy = 'name' } = {}) {
    const _orderBy = sql.ident(orderBy)
    return db.query(
      sql`select * from units order by ${_orderBy} limit ${limit};`
    )
  },

  listForProperty({
    propertyId,
    limit = 10,
    orderBy = 'name',
  }: {
    propertyId: number
    limit?: number
    orderBy?: string
  }) {
    const _orderBy = sql.ident(orderBy)
    const _propertyId = sql.value(propertyId)
    return db.query(
      sql`select * from units where property_id=${_propertyId} order by ${_orderBy} limit ${limit};`
    )
  },

  async byId({ id }: { id: number }) {
    const result = await db.query(
      sql`select * from units where id=${id} limit 1;`
    )
    return result.length ? result[0] : null
  },
}
