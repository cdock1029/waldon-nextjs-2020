import polka from 'polka'
import { db } from 'server'
import type { NextApiResponse, NextApiRequest } from 'next'

const MONEY_REGEX = /^[0-9]+(\.[0-9]{1,2})?$/

export const transactionsRoutes = polka()
  .get('/', async function transactions(req, res: NextApiResponse) {
    res.status(200).json({
      data: await Transactions.listForLease({
        leaseId: parseInt(req.query.leaseId),
      }),
    })
  })
  .post('/pay_balance', async function payBalance(req, res) {
    const { leaseId, date } = req.body
    console.log('pay balance date', date)
    if (typeof leaseId !== 'number') {
      return res.status(422).json({ error: 'Invalid argument' })
    }
    let query
    if (date) {
      query = `select wpm_pay_balance(${leaseId}, '${date}');`
    } else {
      query = `select wpm_pay_balance(${leaseId});`
    }
    await db.schema.raw(query)
    return res.status(200).json({ data: 'success' })
  })
  .post('/pay_rent', async function payBalance(req, res) {
    const { leaseId, date } = req.body
    if (typeof leaseId !== 'number') {
      return res.status(422).json({ error: 'Invalid argument' })
    }
    let query
    if (date) {
      query = `select wpm_pay_rent(${leaseId},'${date}');`
    } else {
      query = `select wpm_pay_rent(${leaseId});`
    }
    await db.schema.raw(query)
    return res.status(200).json({ data: 'success' })
  })
  .post('/pay_custom', async function payBalance(req, res) {
    const { leaseId, amount, date } = req.body
    if (
      typeof leaseId !== 'number' ||
      typeof amount !== 'string' ||
      !amount.match(MONEY_REGEX)
    ) {
      return res.status(422).json({ error: 'Invalid argument' })
    }
    await db('transaction').insert({
      lease_id: leaseId,
      type: 'payment',
      amount: `-${amount}`,
      date,
      notes: 'custom payment',
    })
    return res.status(200).json({ data: 'success' })
  })
  .post('/charge_custom', async function payBalance(req, res) {
    const { leaseId, amount, date, type } = req.body
    if (
      typeof leaseId !== 'number' ||
      typeof amount !== 'string' ||
      !amount.match(MONEY_REGEX) ||
      (type !== 'rent' && type !== 'late_fee')
    ) {
      return res.status(422).json({ error: 'Invalid argument' })
    }
    await db('transaction').insert({
      lease_id: leaseId,
      type,
      amount,
      date,
      // @todo: allow transacton notes to be passed by user
      notes: 'charge applied',
    })
    return res.status(200).json({ data: 'success' })
  })
  .delete('/:transactionId', async function deleteTransaction(req, res) {
    try {
      const transactionId = parseInt(req.params.transactionId)
      console.log('delete txn request', { transactionId })
      await db('transaction').where('id', '=', transactionId).del()
      return res.status(204).send('ok')
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
    orderBy = 'date desc, created_at desc',
  }: {
    leaseId: number
    limit?: number
    orderBy?: string
  }) {
    return db<Transaction>('transaction')
      .select('*')
      .where('lease_id', '=', leaseId)
      .orderByRaw(orderBy)
      .limit(limit)
  },

  // async byId({ id }: { id: number }) {
  //   return db<Unit>('units').first('*').where('id', '=', id)
  // },
}
