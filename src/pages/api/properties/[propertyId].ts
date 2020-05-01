import { NextApiRequest, NextApiResponse } from 'next'
import { propertyById, cache, verifyToken } from 'data'

export default async function property(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { propertyId },
  } = req

  if (await verifyToken(req, res)) {
    const result = await propertyById(parseInt(propertyId as string))
    cache(res).status(200).json(result)
  }
}
