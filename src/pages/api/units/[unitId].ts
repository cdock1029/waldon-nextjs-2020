import { NextApiRequest, NextApiResponse } from 'next'
import { unitById, verifyToken, cache } from 'data'

export default async function unit(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { unitId },
  } = req

  if (await verifyToken(req, res)) {
    const result = await unitById(parseInt(unitId as string))
    cache(res).status(200).json(result)
  }
}
