import polka from 'polka'
import { db } from 'server'
import type { NextApiResponse } from 'next'

export const tenantRoutes = polka()
  .get('/', async function tenants(req, res: NextApiResponse) {
    res.status(200).json({
      data: await db.many(
        'select * from tenant where deleted_at is null order by last_name, first_name'
      ),
    })
  })
  .get('/:tenantId', async function tenant(req, res: NextApiResponse) {
    const tenantId = parseInt(req.params.tenantId)
    res.status(200).json({
      data: await db.one('select * from tenant where id = $1', [tenantId]),
    })
  })
  .post('/', async function postTenant(req, res: NextApiResponse) {
    const tenant = req.body.tenant
    try {
      await db.none(
        'insert into tenant(first_name, last_name, middle_name, suffix, email) values(${first_name}, ${last_name}, ${middle_name}, ${suffix}, ${email})',
        tenant
      )
      res.status(201).json({ data: 'success' })
    } catch (e) {
      res.status(200).json({ error: e.message })
    }
  })
