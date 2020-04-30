import { NextApiRequest, NextApiResponse } from 'next'
import { unitList, verifyToken } from 'data'

export default async function units(req: NextApiRequest, res: NextApiResponse) {
  const verified = await verifyToken(req)
  if (!verified) {
    return res.status(401).json({ error: 'Not authorized' })
  }
  const {
    query: { propertyId },
  } = req

  const result = await unitList(propertyId && parseInt(propertyId as string))
  return res.status(200).json(result)
}
