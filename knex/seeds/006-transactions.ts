import * as Knex from 'knex'

export async function seed(knex: Knex): Promise<any> {
  return knex('transaction')
    .del()
    .then(() => {
      return knex('transaction').insert([
        {
          lease_id: 2,
          amount: '-1300',
          date: '2019-06-25',
          type: 'payment',
          notes: 'two rent payments (pay ahead), for July and Aug 2019',
        },
        {
          lease_id: 2,
          amount: '650',
          date: '2019-07-01',
          type: 'rent',
          notes: 'RENT charge Jul 2019',
        },
        {
          lease_id: 2,
          amount: '650',
          date: '2019-08-01',
          type: 'rent',
          notes: 'RENT charge Aug 2019',
        },
        {
          lease_id: 2,
          amount: '650',
          date: '2019-09-01',
          type: 'rent',
          notes: 'RENT charge Sep 2019',
        },
        {
          lease_id: 2,
          amount: '30',
          date: '2019-09-30',
          type: 'late_fee',
          notes: 'Late fee Sep 2019',
        },
        {
          lease_id: 3,
          amount: '30',
          date: '2019-11-30',
          type: 'late_fee',
        },
        {
          lease_id: 6,
          amount: '710',
          date: '2020-02-01',
          type: 'rent',
        },
        {
          lease_id: 6,
          amount: '30',
          date: '2020-01-31',
          type: 'late_fee',
        },
        {
          lease_id: 7,
          amount: '30',
          date: '2020-04-30',
          type: 'late_fee',
        },
      ])
    })
}
