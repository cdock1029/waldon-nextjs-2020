import polka from 'polka'
import { db } from 'server'
import type { NextApiResponse } from 'next'

export const dashboardRoutes = polka().get('/', async function dashboard(
  req,
  res: NextApiResponse
) {
  let { propertyId, limit = '10', cursor = '', asc } = req.query
  propertyId = parseInt(propertyId)
  limit = parseInt(limit)

  res.status(200).json({
    data: await db.manyOrNone(
      `select name unit, latest.* from unit
      left join lateral(
       select string_agg(tenant.full_name, ',') tenant, lease.*
        from lease
          join lease_tenant on lease_tenant.lease_id = lease.id
          join tenant on tenant.id = lease_tenant.tenant_id
        where lease.unit_id = unit.id
        and lease.end_date > now()
        group by unit.name, lease.id
        order by end_date desc
        limit 1
      ) latest on true
      where unit.property_id = $[propertyId]
      and unit.name ${asc ? '> $[cursor]' : '< $[cursor]'}
      order by unit.name ${asc ? 'asc' : 'desc'}
      fetch first $[limit] rows only`,
      { propertyId, limit, cursor }
    ),
  })
})
