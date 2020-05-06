import db from './db'

export const Tenants = {
  list({ limit = 10, orderBy = ['last_name', 'first_name'] } = {}): Promise<
    Tenant[]
  > {
    return db<Tenant>('tenants')
      .select('*')
      .whereNull('deleted_at')
      .orderBy(orderBy)
    /*
    const query = sql`select * from tenants where deleted_at is null order by last_name, first_name limit ${limit};`
    return db.query(query)
    */
  },

  byId({ id }: { id: number }): Promise<Tenant> {
    return db<Tenant>('tenants').first('*').where('id', '=', id)

    /*
    const result = await db.query(
      sql`select * from tenants where id=${id} limit 1;`
    )
    return result.length ? result[0] : null
    */
  },

  async createTenant(tenant: Tenant): Promise<number[]> {
    return db<Tenant>('tenants').insert(tenant)

    /*
    return db.query(
      sql`insert into tenants(
        first_name,
        middle_name,
        last_name,
        suffix,
        email
      ) values(
        ${tenant.first_name},
        ${tenant.middle_name},
        ${tenant.last_name},
        ${tenant.suffix},
        ${tenant.email}
      );`
    )
    */
  },
}
