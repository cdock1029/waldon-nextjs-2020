import { NextApiRequest, NextApiResponse } from 'next'
import { Properties, cache, verifyToken } from 'server'

export default async function properties(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (await verifyToken(req, res)) {
    cache(res)
      .status(200)
      .json({ data: await Properties.list() })
  }
}
