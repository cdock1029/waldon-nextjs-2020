import { NextApiRequest, NextApiResponse } from 'next'
import { tenantList, cache } from 'data'

export default async function tenants(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await tenantList()
  return cache(res).status(200).json(result)
}
