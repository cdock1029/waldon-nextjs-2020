import polka from 'polka'
import { db } from 'server'
import type { NextApiResponse } from 'next'

export const propertyRoutes = polka()
  .get('/', async function properties(req, res: NextApiResponse) {
    res.status(200).json({ data: await Properties.list() })
  })
  .get('/:propertyId', async function property(req, res: NextApiResponse) {
    res.status(200).json({
      data: await Properties.byId({ id: parseInt(req.params.propertyId) }),
    })
  })

export const Properties = {
  list({ limit = 10, orderBy = 'name' } = {}) {
    return db('properties').select('id', 'name').orderBy(orderBy).limit(limit)
  },

  async byId({ id }: { id: number }) {
    return db<Property>('properties').first('*').where('id', '=', id)
  },
}
