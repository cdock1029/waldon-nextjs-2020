import polka from 'polka'
import { verifyToken } from 'server/utils'
import { authRoutes } from './auth'

import { propertyRoutes } from './properties'
import { unitRoutes } from './units'
import { tenantRoutes } from './tenants'
import { dashboardRoutes } from './dashboard'
import { transactionsRoutes } from './transactions'

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
  .use('transactions', transactionsRoutes)

export const app = polka()
  .use('/api/polka/auth', authRoutes)
  .use('/api/polka/routes', apiRoutes)
