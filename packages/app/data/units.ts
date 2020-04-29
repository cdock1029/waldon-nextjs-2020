import { sql } from '@databases/pg'
import db from './db'

export async function list(propertyId?: number) {
  if (!propertyId) {
    try {
      const data = await Units.list()
      return { data }
    } catch (e) {
      return { error: e.message }
    }
  } else {
    try {
      const data = await Units.listForProperty({ propertyId })
      return { data }
    } catch (e) {
      return { error: e.message }
    }
  }
}

export async function byId(id: number) {
  if (!id) {
    return { error: 'Missing required param: id' }
  }
  try {
    const data = await Units.byId({ id })
    return { data }
  } catch (e) {
    return { error: e.message }
  }
}

const Units = {
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
