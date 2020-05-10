import polka from 'polka'
import { ironSession } from 'next-iron-session'
import { authRoutes } from './auth'
import { propertyRoutes } from './properties'
import { unitRoutes } from './units'
import { tenantRoutes } from './tenants'
import { dashboardRoutes } from './dashboard'
import { transactionsRoutes } from './transactions'

// 5 days
// const expiresIn = 60 * 60 * 24 * 5 * 1000

async function authCheck(req, res, next) {
  const user = req.session.get('user')
  if (user) {
    next()
  } else {
    res.status(401).json({ error: 'not authorized', redirect: '/login' })
  }
}

const session = ironSession({
  cookieName: 'wpm-session',
  password: process.env.SESSION_SECRET!,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/',
  },
})

const apiRoutes = polka()
  .use(authCheck)
  .use('properties', propertyRoutes)
  .use('units', unitRoutes)
  .use('tenants', tenantRoutes)
  .use('dashboard', dashboardRoutes)
  .use('transactions', transactionsRoutes)

export const app = polka()
  .use(session)
  .use('/api/polka/auth', authRoutes)
  .use('/api/polka/routes', apiRoutes)
