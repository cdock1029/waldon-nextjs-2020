import polka from 'polka'
import { serialize } from 'cookie'
import * as bcrypt from 'bcrypt'
import { createSessionCookie, revokeSession } from 'server/utils'
import { db } from 'server'

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
  .post('/signin', async function signin(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    ;(req as any).session.user = null
    const { username, password } = req.body
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: 'invalid request. username and password required' })
    }

    const user = await db<{ password_digest: string }>('wpm_user')
      .first('username', 'email', 'password_digest', 'created_at', 'updated_at')
      .where('username', '=', username)

    if (!user) {
      return res.status(401).send({ error: 'credentials invalid' })
    }

    bcrypt.compare(password, user.password_digest, (err, response) => {
      if (err || !response) {
        return res.status(401).json({ error: 'credentials invalid' })
      }

      delete user.password_digest
      ;(req as any).session.user = user

      return res.status(200).json({ user })
    })
  })
  .post('/signout', async function signout(req, res: NextApiResponse) {
    if (req.session && req.session.user) {
      console.log('session exists. deleting')
      req.session = null
    } else {
      console.log('session not found')
    }
    return res.status(205).json({ data: 'signed out', redirect: '/login' })
  })
  .post('/signup', function signup(req: NextApiRequest, res: NextApiResponse) {
    const { username, password, email } = req.body
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ error: 'invalid request. missing credentials' })
    }

    bcrypt.hash(password, 10, async (err, password_digest) => {
      if (err || !password_digest) {
        console.error('/signup error: ', err)
        return res.status(400).json({ error: 'invalid request' })
      }

      try {
        const result: any = await db('wpm_user').insert({
          username,
          email,
          password_digest,
        })
        return res.status(201).json({ data: true })
      } catch (e) {
        return res.status(400).json({
          error:
            e.code === '23505'
              ? 'user already exists'
              : 'credentials invalid, creating user failed.',
        })
      }
    })
    // db('user').insert({})
  })
  .get('/test', function test(req, res: NextApiResponse) {
    if (req.session && req.session.user) {
      return res.status(200).json({ data: 'user session exists' })
    } else {
      return res.status(200).json({ data: 'no user session' })
    }
  })
