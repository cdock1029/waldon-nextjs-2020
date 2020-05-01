import { NextApiRequest, NextApiResponse } from 'next'
import { propertyList, cache, verifyToken } from 'data'

export default async function properties(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (await verifyToken(req, res)) {
    const result = await propertyList()
    cache(res).status(200).json(result)
  }
}
