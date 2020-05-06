import { NextApiRequest, NextApiResponse } from 'next'
import { Tenants, cache, verifyToken } from 'server'

export default async function tenant(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { tenantId },
  } = req

  if (await verifyToken(req, res)) {
    cache(res)
      .status(200)
      .json({ data: await Tenants.byId({ id: parseInt(tenantId as string) }) })
  }
}
