import { NextApiRequest, NextApiResponse } from 'next'
import { tenantById, cache, verifyToken } from 'data'

export default async function tenant(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { tenantId },
  } = req

  if (await verifyToken(req, res)) {
    const result = await tenantById(parseInt(tenantId as string))
    cache(res).status(200).json(result)
  }
}
