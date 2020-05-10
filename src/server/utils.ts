import type { NextApiResponse } from 'next'

export function cache(
  res: NextApiResponse,
  { maxAge = 60 }: { maxAge?: number } = {}
): NextApiResponse {
  res.setHeader('Cache-Control', `private, s-maxage=0`)
  return res
}
