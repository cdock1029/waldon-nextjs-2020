import polka from 'polka'
import { serialize } from 'cookie'
import { createSessionCookie, revokeSession } from 'server/utils'
import type { NextApiRequest, NextApiResponse } from 'next'

export const authRoutes = polka()
  .post('/login', async function login(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
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
      res.status(401).send('Unauthorized')
    }
  })
  .post('/logout', async function logout(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const sessionCookie = req.cookies.session || ''

    const cookie = serialize('session', '', {
      maxAge: -1,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
    })
    res.setHeader('Set-Cookie', cookie)

    try {
      await revokeSession(sessionCookie)
    } catch (e) {
      console.error('Error revoking cookie session:', e.message)
    } finally {
      res.writeHead(302, { Location: '/login' })
      res.end()
    }
  })
