import { NextApiRequest, NextApiResponse } from 'next'
import { unitById } from 'data'

export default async function unit(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { unitId },
  } = req

  if (!unitId || typeof unitId !== 'string') {
    return res.status(422).json({ error: 'Unit ID is required' })
  }

  const result = await unitById(parseInt(unitId))
  return res.status(200).json(result)
}
