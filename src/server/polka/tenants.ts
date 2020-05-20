import polka from 'polka'
import { db } from 'server'
import type { NextApiResponse } from 'next'

export const tenantRoutes = polka()
  .get('/', async function tenants(req, res: NextApiResponse) {
    res.status(200).json({
      data: await db<Tenant>('tenant')
        .select('*')
        .whereNull('deleted_at')
        .orderBy(['last_name', 'first_name']),
    })
  })
  .get('/:tenantId', async function tenant(req, res: NextApiResponse) {
    const tenantId = parseInt(req.params.tenantId)
    res.status(200).json({
      data: await db<Tenant>('tenant').first('*').where('id', '=', tenantId),
    })
  })
  .post('/', async function postTenant(req, res: NextApiResponse) {
    const tenant = req.body.tenant
    try {
      const data = await db<Tenant>('tenant').insert(tenant)
      res.status(200).json({ data })
    } catch (e) {
      res.status(200).json({ error: e.message })
    }
  })
