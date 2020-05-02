import { NextApiRequest, NextApiResponse } from 'next'
import { Units, verifyToken, cache } from 'data'

export default async function units(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { propertyId },
  } = req

  if (await verifyToken(req, res)) {
    cache(res, { maxAge: 60 })
      .status(200)
      .json({
        data: await Units.listForProperty({
          propertyId: parseInt(propertyId as string),
        }),
      })
  }
}
