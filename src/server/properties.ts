import db from './db'

export const Properties = {
  list({ limit = 10, orderBy = 'name' } = {}) {
    return db('properties').select('*').orderBy(orderBy).limit(limit)
    /*
    return db.query(
      sql`select * from properties order by ${_orderBy} limit ${limit};`
    )
    */
  },

  async byId({ id }: { id: number }) {
    return db<Property>('properties').first('*').where('id', '=', id)
    /*
    const result = await db.query(
      sql`select * from properties where id=${id} limit 1;`
    )
    return result.length ? result[0] : null
    */
  },
}
