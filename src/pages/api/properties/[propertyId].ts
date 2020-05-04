import { NextApiRequest, NextApiResponse } from 'next'
import { Properties, cache, verifyToken } from 'server'

export default async function property(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { propertyId },
  } = req

  if (await verifyToken(req, res)) {
    cache(res)
      .status(200)
      .json({
        data: await Properties.byId({ id: parseInt(propertyId as string) }),
      })
  }
}
