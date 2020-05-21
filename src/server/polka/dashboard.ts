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
    const query = db<DashboardLease>('lease')
      .join('unit', 'lease.unit_id', '=', 'unit.id')
      .join('lease_tenant', 'lease_tenant.lease_id', '=', 'lease.id')
      .join('tenant', 'tenant.id', '=', 'lease_tenant.tenant_id')
      .distinctOn('lease.unit_id')
      .select(
        'unit.name as unit',
        db.raw(
          "string_agg(tenant.full_name, ',') over (partition by lease_tenant.lease_id) as tenant"
        ),
        'lease.*'
      )
      .whereRaw('now()::date <@ lease.span')
      .orderBy(['lease.unit_id', { column: 'lease.start_date', order: 'desc' }])
      .limit(limit)
      .offset(offset)
    if (propertyId) {
      query.where('unit.property_id', '=', propertyId)
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
    return db('transaction')
      .select('*')
      .where('lease_id', '=', leaseId)
      .limit(limit)
      .offset(offset)
  },
}
