import { NextApiRequest, NextApiResponse } from 'next'
import { tenantById, cache } from 'data'

export default async function tenant(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { tenantId },
  } = req
  res = cache(res)

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(422).json({ error: 'Tenant ID is required' })
  }

  const result = await tenantById(parseInt(tenantId))
  return res.status(200).json(result)
}
