import db from './db'

export const Dashboard = {
  async leases({ limit = 50, offset = 0 } = {}) {
    return db<any>('leases')
      .join('units', 'leases.unit_id', '=', 'units.id')
      .join('lease_tenants', 'lease_tenants.lease_id', '=', 'leases.id')
      .join('tenants', 'tenants.id', '=', 'lease_tenants.tenant_id')
      .distinctOn('leases.unit_id')
      .select(
        'units.name as unit',
        db.raw(
          "string_agg(tenants.full_name, ',') over (partition by lease_tenants.lease_id) as tenant"
        ),
        'leases.*'
      )
      .orderBy([
        'leases.unit_id',
        { column: 'leases.start_date', order: 'desc' },
      ])
      .limit(limit)
      .offset(offset)

    /*
    return db.query(
      sql`select distinct on (l.unit_id)
      u.name unit,
      string_agg(t.full_name, ', ') over (partition by lt.lease_id) tenant
      ,l.*
      from leases l
      join units u on u.id=l.unit_id
      join lease_tenants lt on lt.lease_id=l.id
      join tenants t on t.id=lt.tenant_id
      order by l.unit_id, l.start_date desc limit ${limit} offset ${offset};`
    )
    */
  },

  transactionsByLeaseId({
    leaseId,
    limit = 50,
    offset = 0,
  }: {
    leaseId: number
    limit?: number
    offset?: number
  }) {
    return db('transactions')
      .select('*')
      .where('lease_id', '=', leaseId)
      .limit(limit)
      .offset(offset)
    /*
    return db.query(
      sql`select * from transactions where lease_id = ${leaseId} limit ${limit} offset ${offset};`
    )
    */
  },
}
