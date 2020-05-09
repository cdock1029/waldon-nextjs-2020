import polka from 'polka'
import * as bcrypt from 'bcrypt'
import { db } from 'server'

import type { NextApiRequest, NextApiResponse } from 'next'

export const authRoutes = polka()
  .post('/login', async function signin(
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
  .post('/logout', async function signout(req, res: NextApiResponse) {
    req.session = null
    return res.status(205).json({ data: 'logged out', redirect: '/login' })
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
  })
  .get('/test', function test(req, res: NextApiResponse) {
    if (req.session && req.session.user) {
      return res.status(200).json({ data: 'user session exists' })
    } else {
      return res.status(200).json({ data: 'no user session' })
    }
  })
