import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'
import { revokeSession } from 'data/utils'

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const sessionCookie = req.cookies.session || ''

    const cookie = serialize('session', '', {
      maxAge: -1,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
    })
    res.setHeader('Set-Cookie', cookie)

    await revokeSession(sessionCookie)

    res.writeHead(302, { Location: '/login' })
    res.end()
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
