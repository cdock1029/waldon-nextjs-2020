import polka from 'polka'
import { propertyRoutes } from './properties'
import { unitRoutes } from './units'
import { tenantRoutes } from './tenants'
import { dashboardRoutes } from './dashboard'
import { authRoutes } from './auth'
import { verifyToken } from 'server/utils'

async function auth(req, res, next) {
  const verified = await verifyToken(req, res)
  if (verified) {
    next()
  }
}

const apiRoutes = polka()
  .use(auth)
  .use('properties', propertyRoutes)
  .use('units', unitRoutes)
  .use('tenants', tenantRoutes)
  .use('dashboard', dashboardRoutes)

export const app = polka()
  .use('/api/polka/auth', authRoutes)
  .use('/api/polka/routes', apiRoutes)
