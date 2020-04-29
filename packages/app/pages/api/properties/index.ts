import { NextApiRequest, NextApiResponse } from 'next'
import { propertyList, cache } from 'data'

export default async function properties(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await propertyList()
  return cache(res).status(200).json(result)
}
