import { NextApiRequest, NextApiResponse } from 'next'
import { tenantList, cache, verifyToken } from 'data'

export default async function tenants(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (await verifyToken(req, res)) {
    const result = await tenantList()
    cache(res).status(200).json(result)
  }
}
