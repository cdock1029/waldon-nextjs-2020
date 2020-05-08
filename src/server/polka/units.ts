import polka from 'polka'
import { db } from 'server'
import type { NextApiResponse } from 'next'

export const unitRoutes = polka()
  .get('/', async function units(req, res: NextApiResponse) {
    res.status(200).json({
      data: await Units.listForProperty({
        propertyId: parseInt(req.query.propertyId),
      }),
    })
  })
  .get('/:unitId', async function unit(req, res: NextApiResponse) {
    res.status(200).json({
      data: await Units.byId({ id: parseInt(req.params.unitId) }),
    })
  })

export const Units = {
  async list({ limit = 10, orderBy = 'name' } = {}) {
    return db<Unit>('unit').select('*').orderBy(orderBy).limit(limit)
  },

  async listForProperty({
    propertyId,
    limit = 10,
    orderBy = 'name',
  }: {
    propertyId: number
    limit?: number
    orderBy?: string
  }) {
    return db<Unit>('unit')
      .select('*')
      .where('property_id', '=', propertyId)
      .orderBy(orderBy)
      .limit(limit)
  },

  async byId({ id }: { id: number }) {
    return db<Unit>('unit').first('*').where('id', '=', id)
  },
}
