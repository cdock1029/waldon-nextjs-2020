import type { NextApiRequest, NextApiResponse } from 'next'
import { Dashboard } from 'data'

export default async function dashboard(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({
    data: await Dashboard.leases(),
  })
}
