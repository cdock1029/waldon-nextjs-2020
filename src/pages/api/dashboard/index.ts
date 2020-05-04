import type { NextApiRequest, NextApiResponse } from 'next'
import { Dashboard, cache, verifyToken } from 'server'

export default async function dashboard(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (await verifyToken(req, res)) {
    cache(res)
      .status(200)
      .json({
        data: await Dashboard.leases(),
      })
  }
}
