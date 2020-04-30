import { NextApiRequest, NextApiResponse } from 'next'
import { unitList } from 'data'

export default async function units(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { propertyId },
  } = req

  const result = await unitList(propertyId && parseInt(propertyId as string))
  return res.status(200).json(result)
}
