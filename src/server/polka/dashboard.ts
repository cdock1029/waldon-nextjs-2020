import polka from 'polka'
import { db } from 'server'
import type { NextApiResponse } from 'next'

export const dashboardRoutes = polka().get('/', async function dashboard(
  req,
  res: NextApiResponse
) {
  res.status(200).json({
    data: await Dashboard.leases({ propertyId: req.query.propertyId }),
  })
})

export const Dashboard = {
  async leases({
    limit = 50,
    offset = 0,
    propertyId = undefined,
  }: { limit?: number; offset?: number; propertyId?: number } = {}) {
    const query = db<any>('leases')
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
    if (propertyId) {
      query.where('units.property_id', '=', propertyId)
    }
    return query
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
  },
}
