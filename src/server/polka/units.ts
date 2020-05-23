import polka from 'polka'
import { db } from 'server'
import type { NextApiResponse } from 'next'

export const unitRoutes = polka()
  .get('/', async function units(req, res: NextApiResponse) {
    const propertyId = parseInt(req.query.propertyId)
    res.status(200).json({
      data: await db.many(
        'select * from unit where property_id = $1 order by name limit 20',
        propertyId
      ),
    })
  })
  .get('/:unitId', async function unit(req, res: NextApiResponse) {
    const unitId = parseInt(req.params.unitId)
    res.status(200).json({
      data: await db.one('select * from unit where id = $1', unitId),
    })
  })
