import polka from 'polka'
import { db } from 'server'
import type { NextApiResponse } from 'next'

const MONEY_REGEX = /^[0-9]+(\.[0-9]{1,2})?$/

export const transactionsRoutes = polka()
  .get('/', async function transactions(req, res: NextApiResponse) {
    const leaseId = parseInt(req.query.leaseId)
    res.status(200).json({
      data: await db<Transaction>('transaction')
        .select(
          db.raw('transaction.*, sum(amount) over(order by date) as balance')
        )
        .where('lease_id', '=', leaseId)
        .orderByRaw('date desc, created_at desc')
        .limit(50),
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
    return res.status(201).json({ data: 'success' })
  })
  .post('/pay_rent', async function payRent(req, res) {
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
    return res.status(201).json({ data: 'success' })
  })
  .post('/pay_custom', async function payCustom(req, res) {
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
    return res.status(201).json({ data: 'success' })
  })
  .post('/charge_custom', async function chargeCustom(req, res) {
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
    return res.status(201).json({ data: 'success' })
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
  .put('/transaction_update/:id', async function txnUpdate(req, res) {
    const id = parseInt(req.params.id)
    const { amount, date, type } = req.body
    if (
      typeof amount !== 'string' ||
      (type !== 'rent' && type !== 'late_fee' && type !== 'payment') ||
      !amount.match(MONEY_REGEX)
    ) {
      return res.status(422).json({ error: 'Invalid argument' })
    }
    let updateParams: any = {
      // @todo: fix this negative sign checking
      amount: type === 'payment' ? `-${amount}` : amount,
      notes: `transaction updated ${new Date().toLocaleDateString()}`,
    }
    if (date) {
      updateParams.date = date
    }
    await db('transaction').where('id', '=', id).update(updateParams)
    return res.status(200).json({ data: 'success' })
  })
