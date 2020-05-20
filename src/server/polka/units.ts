import polka from 'polka'
import { db } from 'server'
import type { NextApiResponse } from 'next'

export const unitRoutes = polka()
  .get('/', async function units(req, res: NextApiResponse) {
    const propertyId = parseInt(req.query.propertyId)
    res.status(200).json({
      data: await db<Unit>('unit')
        .select('*')
        .where('property_id', '=', propertyId)
        .orderBy('name')
        .limit(10),
    })
  })
  .get('/:unitId', async function unit(req, res: NextApiResponse) {
    const unitId = parseInt(req.params.unitId)
    res.status(200).json({
      data: await db<Unit>('unit').first('*').where('id', '=', unitId),
    })
  })
