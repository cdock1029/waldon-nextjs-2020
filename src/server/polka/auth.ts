import polka from 'polka'
import * as bcrypt from 'bcrypt'
import { db } from 'server'

import type { NextApiResponse } from 'next'

export const authRoutes = polka()
  .post('/login', async function signin(req, res: NextApiResponse) {
    const { username, password } = req.body
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: 'invalid request. username and password required' })
    }

    let user
    try {
      user = await db.one(
        'select username,email,password_digest,created_at,updated_at from wpm_user where username = $1',
        username
      )
    } catch (e) {
      return res.status(401).send({ error: 'credentials invalid' })
    }
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
    let result
    try {
      result = await db.one(
        'select username from allowed_user where username = $1',
        username
      )
    } catch (e) {
      return res.status(403).send('forbidden')
    }
    if (!result) {
      return res.status(403).send('forbidden')
    }

    try {
      const password_digest = await bcrypt.hash(password, 10)
      const user = {
        username,
        email,
        password_digest,
      }
      await db.none(
        'insert into wpm_user(username,email,password_digest) values(${username},${email},${password_digest})',
        user
      )
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
