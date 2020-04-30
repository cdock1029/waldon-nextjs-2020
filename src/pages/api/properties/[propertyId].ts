import { NextApiRequest, NextApiResponse } from 'next'
import { propertyById, cache } from 'data'

export default async function property(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res = cache(res)

  const {
    query: { propertyId },
  } = req

  if (!propertyId || typeof propertyId !== 'string') {
    return res.status(422).json({ error: 'Property ID is required' })
  }

  const result = await propertyById(parseInt(propertyId))
  return res.status(200).json(result)
}
