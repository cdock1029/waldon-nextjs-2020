import polka from 'polka'
import { db } from 'server'
import type { NextApiResponse, NextApiRequest } from 'next'

export const transactionsRoutes = polka()
  .get('/', async function transactions(req, res: NextApiResponse) {
    res.status(200).json({
      data: await Transactions.listForLease({
        leaseId: parseInt(req.query.leaseId),
      }),
    })
  })
  .post('/pay_balance', async function payBalance(req, res) {
    console.log({ body: req.body })
    const leaseId = req.body.leaseId
    // @todo: add date parameter to pay_balance function
    // const date = req.body.date
    if (typeof leaseId !== 'number') {
      throw new Error('invalid argument')
    }
    await db.schema.raw(`
      select wpm_pay_balance(${leaseId});
    `)
    return res.status(200).json({ data: 'success' })
  })
  .post('/pay_rent', async function payBalance(req, res) {
    const leaseId = req.body.leaseId
    // @todo: add date parameter to pay_rent function
    // const date = req.body.date
    if (typeof leaseId !== 'number') {
      throw new Error('invalid argument')
    }
    await db.schema.raw(`
      select wpm_pay_rent(${leaseId});
    `)
    return res.status(200).json({ data: 'success' })
  })
  .delete('/:transactionId', async function deleteTransaction(req, res) {
    try {
      const transactionId = parseInt(req.params.transactionId)
      console.log('delete txn request', { transactionId })
      await db('transaction').where('id', '=', transactionId).del()
      return res.status(204).send()
    } catch (e) {
      return res.status(400).json({ error: 'Invalid request' })
    }
  })

export const Transactions = {
  // async list({ limit = 10, orderBy = 'name' } = {}) {
  //   return db<Unit>('units').select('*').orderBy(orderBy).limit(limit)
  // },

  async listForLease({
    leaseId,
    limit = 10,
    orderBy = ['date', 'desc'],
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
