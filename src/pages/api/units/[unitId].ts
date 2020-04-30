import { NextApiRequest, NextApiResponse } from 'next'
import { unitById, verifyToken } from 'data'

export default async function unit(req: NextApiRequest, res: NextApiResponse) {
  const verified = await verifyToken(req)
  if (!verified) {
    return res.status(401).json({ error: 'Not authorized' })
  }
  const {
    query: { unitId },
  } = req

  if (!unitId || typeof unitId !== 'string') {
    return res.status(422).json({ error: 'Unit ID is required' })
  }

  const result = await unitById(parseInt(unitId))
  return res.status(200).json(result)
}
