import polka from 'polka'
import { db } from 'server'
import type { NextApiResponse } from 'next'

export const propertyRoutes = polka()
  .get('/', async function properties(req, res: NextApiResponse) {
    res.status(200).json({
      data: await db.many(
        'select id, name from property order by name limit 50'
      ),
    })
  })
  .get('/:propertyId', async function property(req, res: NextApiResponse) {
    const propertyId = parseInt(req.params.propertyId)
    res.status(200).json({
      data: await db.one('select id, name from property where id = $1', [
        propertyId,
      ]),
    })
  })
