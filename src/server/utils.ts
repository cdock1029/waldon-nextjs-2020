import { ironSession } from 'next-iron-session'
import type { NextApiResponse } from 'next'

export function cache(
  res: NextApiResponse,
  { maxAge = 60 }: { maxAge?: number } = {}
): NextApiResponse {
  res.setHeader('Cache-Control', `private, s-maxage=0`)
  return res
}

export const session = ironSession({
  cookieName: 'wpm-session',
  password: process.env.SESSION_SECRET!,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  },
})

export async function sessionWrap({ req, res }) {
  return new Promise((resolve) => {
    session(req, res, resolve)
  })
}
