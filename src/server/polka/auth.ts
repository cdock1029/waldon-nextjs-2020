import polka from 'polka'
import * as bcrypt from 'bcrypt'
import { db } from 'server'

import type { NextApiRequest, NextApiResponse } from 'next'

export const authRoutes = polka()
  .post('/login', async function signin(req, res: NextApiResponse) {
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

    try {
      const response = await bcrypt.compare(password, user.password_digest)
      if (!response) {
        return res.status(401).json({ error: 'credentials invalid' })
      }
      console.log('bcrypt true')
      delete user.password_digest

      req.session.set('user', user)
      await req.session.save()

      console.log({ session: req.session.get('user') })
      return res.status(200).json({ user })
    } catch (err) {
      console.log('bcrypt compare err:', err)
      return res.status(401).json({ error: 'credentials invalid' })
    }
  })
  .post('/logout', async function signout(req, res: NextApiResponse) {
    req.session.destroy()
    return res.status(205).json({ data: 'logged out', redirect: '/login' })
  })
  .post('/signup', async function signup(req, res: NextApiResponse) {
    const { username, password, email } = req.body
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ error: 'invalid request. missing credentials' })
    }
    const allowed = await db('allowed_user')
      .first('username')
      .where('username', '=', username)
    if (!allowed) {
      return res.status(403).send('forbidden')
    }

    try {
      const password_digest = await bcrypt.hash(password, 10)
      await db('wpm_user').insert({
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
  .get('/test', function test(req, res: NextApiResponse) {
    const user = req.session.get('user')
    if (user) {
      return res.status(200).json({ data: 'user session exists', user })
    } else {
      return res.status(200).json({ data: 'no user session' })
    }
  })
