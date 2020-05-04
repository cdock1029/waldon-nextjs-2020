import type { NextApiRequest, NextApiResponse } from 'next'
import { createSessionCookie } from 'server/utils'
import { serialize } from 'cookie'

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const token = req.body.token

    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000
    // Create the session cookie. This will also verify the ID token in the process.
    // The session cookie will have the same claims as the ID token.

    // @todo: To only allow session cookie setting on recent sign-in, auth_time in ID token
    // can be checked to ensure user was recently signed in before creating a session cookie.
    try {
      const sessionCookie = await createSessionCookie(token, { expiresIn })
      const cookie = serialize('session', sessionCookie, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/api/',
        sameSite: 'strict',
      })
      res.setHeader('Set-Cookie', cookie)
      res.status(200).json({ done: true })
    } catch (error) {
      res.status(401).send('UNAUTHORIZED REQUEST!')
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
