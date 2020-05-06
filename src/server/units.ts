import db from './db'

export const Units = {
  async list({ limit = 10, orderBy = 'name' } = {}) {
    return db<Unit>('units').select('*').orderBy(orderBy).limit(limit)
    /*
    return db.query(
      sql`select * from units order by ${_orderBy} limit ${limit};`
    )
    */
  },

  async listForProperty({
    propertyId,
    limit = 10,
    orderBy = 'name',
  }: {
    propertyId: number
    limit?: number
    orderBy?: string
  }) {
    return db<Unit>('units')
      .select('*')
      .where('property_id', '=', propertyId)
      .orderBy(orderBy)
      .limit(limit)

    //const _orderBy = sql.ident(orderBy)
    //const _propertyId = sql.value(propertyId)
    /*
    return db.query(
      sql`select * from units where property_id=${_propertyId} order by ${_orderBy} limit ${limit};`
    )
    */
  },

  async byId({ id }: { id: number }) {
    return db<Unit>('units').first('*').where('id', '=', id)
    /*
    const result = await db.query(
      sql`select * from units where id=${id} limit 1;`
    )
    return result.length ? result[0] : null
    */
  },
}
