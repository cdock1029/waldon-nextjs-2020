import type { NextApiResponse } from 'next'

export { list as propertyList, byId as propertyById } from './properties'
export { list as unitList, byId as unitById } from './units'
export { list as tenantList, byId as tenantById } from './tenants'

export function cache(res: NextApiResponse): NextApiResponse {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  return res
}
