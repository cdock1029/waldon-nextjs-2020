import polka from 'polka'
import { db } from 'server'
import type { NextApiResponse } from 'next'

export const transactionsRoutes = polka().get('/', async function units(
  req,
  res: NextApiResponse
) {
  console.log({ leaseId: req.query.leaseId })
  res.status(200).json({
    data: await Transactions.listForLease({
      leaseId: parseInt(req.query.leaseId),
    }),
  })
})

export const Transactions = {
  // async list({ limit = 10, orderBy = 'name' } = {}) {
  //   return db<Unit>('units').select('*').orderBy(orderBy).limit(limit)
  // },

  async listForLease({
    leaseId,
    limit = 10,
    orderBy = ['txn_date', 'desc'],
  }: {
    leaseId: number
    limit?: number
    orderBy?: [string, string]
  }) {
    return db<Transaction>('transaction')
      .select('*')
      .where('lease_id', '=', leaseId)
      .orderBy(...orderBy)
      .limit(limit)
  },

  // async byId({ id }: { id: number }) {
  //   return db<Unit>('units').first('*').where('id', '=', id)
  // },
}
