import { NextApiRequest, NextApiResponse } from 'next'
import { Units, verifyToken, cache } from 'server'

export default async function unit(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { unitId },
  } = req

  if (await verifyToken(req, res)) {
    cache(res, { maxAge: 60 })
      .status(200)
      .json({
        data: await Units.byId({ id: parseInt(unitId as string) }),
      })
  }
}
