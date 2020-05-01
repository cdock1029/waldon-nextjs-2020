import { NextApiRequest, NextApiResponse } from 'next'
import { unitList, verifyToken, cache } from 'data'

export default async function units(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { propertyId },
  } = req

  if (await verifyToken(req, res)) {
    const result = await unitList(propertyId && parseInt(propertyId as string))
    cache(res).status(200).json(result)
  }
}
