import { NextApiRequest, NextApiResponse } from 'next'
import { Tenants, cache, verifyToken } from 'server'

export default async function tenants(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (await verifyToken(req, res)) {
    if (req.method === 'GET') {
      cache(res)
        .status(200)
        .json({ data: await Tenants.list() })
    } else if (req.method === 'POST') {
      const tenant = req.body.tenant

      try {
        const data = await Tenants.createTenant(tenant)
        res.status(200).json({ data })
      } catch (e) {
        res.status(200).json({ error: e.message })
      }
    }
  }
}
