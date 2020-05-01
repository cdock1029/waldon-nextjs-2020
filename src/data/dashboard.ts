// `select distinct l.id,string_agg(distinct u.name, ',') unit,string_agg(t.last_name, ',') tenant,string_agg(distinct t.id::text, ',') tenant_id,l.start_date,l.end_date,rent,balance from leases l join units u on u.id=l.unit_id join lease_tenants lt on lt.lease_id=l.id join tenants t on t.id=lt.tenant_id group by l.id;`

import { sql } from '@databases/pg'
import db from './db'

// export async function leases() {
//   try {
//     const data = await Dashboard.leases()
//     return { data }
//   } catch (e) {
//     return { error: e.message }
//   }
// }

// export async function transactionsByLeaseId(id: number) {
//   if (!id) {
//     return { error: 'Missing required param: id' }
//   }
//   try {
//     const data = await Properties.byId({ id })
//     return { data }
//   } catch (e) {
//     // @todo: dont expose internal errors
//     return { error: e.message }
//   }
// }

export default {
  leases({ limit = 50, offset = 0 } = {}) {
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
    return db.query(
      sql`select * from transactions where lease_id = ${leaseId} limit ${limit} offset ${offset};`
    )
  },
}
