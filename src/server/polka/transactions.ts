import polka from 'polka'
import { db } from 'server'
import type { NextApiResponse } from 'next'

const MONEY_REGEX = /^[0-9]+(\.[0-9]{1,2})?$/

export const transactionsRoutes = polka()
  .get('/', async function transactions(req, res: NextApiResponse) {
    const leaseId = parseInt(req.query.leaseId)
    res.status(200).json({
      data: await db.many(
        `select t.*, sum(amount) over(order by date) as balance
      from transaction t where lease_id = $1
      order by date desc, created_at desc limit 50`,
        leaseId
      ),
    })
  })
  .post('/pay_balance', async function payBalance(req, res) {
    const { leaseId, date } = req.body
    if (typeof leaseId !== 'number') {
      return res.status(422).json({ error: 'Invalid argument' })
    }
    let params: any = [leaseId]
    if (date) {
      params.push(date)
    }
    try {
      await db.func('wpm_pay_balance', params)
      return res.status(201).json({ data: 'success' })
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  })
  .post('/pay_rent', async function payRent(req, res) {
    const { leaseId, date } = req.body
    if (typeof leaseId !== 'number') {
      return res.status(422).json({ error: 'Invalid argument' })
    }
    let params: any = [leaseId]
    if (date) {
      params.push(date)
    }
    try {
      await db.func('wpm_pay_rent', params)
      return res.status(201).json({ data: 'success' })
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
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
    const txn = {
      lease_id: leaseId,
      type: 'payment',
      amount: `-${amount}`,
      date,
      notes: 'custom payment',
    }
    try {
      await db.none(
        `insert into transaction(lease_id,type,amount,date,notes)
        values($<lease_id>,$<type>,$<amount>,$<date>,$<notes>)`,
        txn
      )
      return res.status(201).json({ data: 'success' })
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
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
    const txn = {
      lease_id: leaseId,
      type,
      amount,
      date,
      // @todo: allow transacton notes to be passed by user
      notes: 'charge applied',
    }
    try {
      await db.none(
        `insert into transaction(lease_id,type,amount,date,notes)
        values($<lease_id>,$<type>,$<amount>,$<date>,$<notes>)`,
        txn
      )
      return res.status(201).json({ data: 'success' })
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  })
  .delete('/:transactionId', async function deleteTransaction(req, res) {
    try {
      const transactionId = parseInt(req.params.transactionId)
      await db.none('delete from transaction where id = $1', transactionId)
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
      date,
      id,
    }
    try {
      await db.none(
        'update transaction set amount = ${amount},notes = ${notes},date = ${date} where id = ${id}',
        updateParams
      )
      return res.status(200).json({ data: 'success' })
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  })
