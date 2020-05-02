import { NextApiRequest, NextApiResponse } from 'next'
import { Properties, cache, verifyToken } from 'data'

export default async function property(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { propertyId },
  } = req

  if (await verifyToken(req, res)) {
    cache(res, { maxAge: 60 })
      .status(200)
      .json({
        data: await Properties.byId({ id: parseInt(propertyId as string) }),
      })
  }
}
