import polka from 'polka'
import { db } from 'server'
import type { NextApiResponse } from 'next'

export const tenantRoutes = polka()
  .get('/', async function tenants(req, res: NextApiResponse) {
    res.status(200).json({ data: await Tenants.list() })
  })
  .get('/:tenantId', async function tenant(req, res: NextApiResponse) {
    res.status(200).json({
      data: await Tenants.byId({ id: parseInt(req.params.tenantId) }),
    })
  })
  .post('/', async function postTenant(req, res: NextApiResponse) {
    const tenant = req.body.tenant
    try {
      const data = await Tenants.createTenant(tenant)
      res.status(200).json({ data })
    } catch (e) {
      res.status(200).json({ error: e.message })
    }
  })

export const Tenants = {
  list({ limit = 10, orderBy = ['last_name', 'first_name'] } = {}): Promise<
    Tenant[]
  > {
    return db<Tenant>('tenants')
      .select('*')
      .whereNull('deleted_at')
      .orderBy(orderBy)
  },

  byId({ id }: { id: number }): Promise<Tenant> {
    return db<Tenant>('tenants').first('*').where('id', '=', id)
  },

  async createTenant(tenant: Tenant): Promise<number[]> {
    return db<Tenant>('tenants').insert(tenant)
  },
}
