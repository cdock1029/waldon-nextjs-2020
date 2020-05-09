import polka from 'polka'
import { verifyToken } from 'server/utils'
import cookieSession from 'cookie-session'
import { db } from 'server'
import { authRoutes } from './auth'
import { propertyRoutes } from './properties'
import { unitRoutes } from './units'
import { tenantRoutes } from './tenants'
import { dashboardRoutes } from './dashboard'
import { transactionsRoutes } from './transactions'

// 5 days
const expiresIn = 60 * 60 * 24 * 5 * 1000

// async function auth(req, res, next) {
//   const verified = await verifyToken(req, res)
//   if (verified) {
//     next()
//   }
// }

const apiRoutes = polka()
  .use('properties', propertyRoutes)
  .use('units', unitRoutes)
  .use('tenants', tenantRoutes)
  .use('dashboard', dashboardRoutes)
  .use('transactions', transactionsRoutes)

export const app = polka()
  .use(
    cookieSession({
      secret: process.env.SESSION_SECRET!,
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/api/',
      sameSite: 'strict',
    })
  )
  .use('/api/polka/auth', authRoutes)
  .use('/api/polka/routes', apiRoutes)
