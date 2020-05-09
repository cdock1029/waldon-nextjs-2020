import * as Knex from 'knex'

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex('lease')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('lease').insert([
        {
          // 1
          unit_id: 1,
          rent: '$600',
          start_date: '2018-08-01',
          end_date: '2019-08-01',
          evicted_at: '2019-06-30',
          balance: '$600',
          security_deposit_collected: '2018-07-30',
          security_deposit: '$600',
          notes: 'evicted 2019-06-30, still owes money',
        },
        {
          // 2
          unit_id: 1,
          rent: '$650',
          security_deposit: '$650',
          security_deposit_collected: '2019-07-05',
          start_date: '2019-07-01',
          end_date: '2020-07-01',
          notes:
            'When initialized, should have -650 balance with 2 rent payments applied, 1 rent charge',
        },

        {
          // 3
          unit_id: 2,
          rent: '$660',
          security_deposit: '$660',
          security_deposit_collected: '2019-09-01',
          start_date: '2019-09-01',
          end_date: '2020-09-01',
          balance: '$30',
        },
        {
          // 4
          unit_id: 2,
          rent: '$660',
          security_deposit_collected: '2015-01-01',
          security_deposit_returned: '2016-01-04',
          start_date: '2015-01-01',
          end_date: '2016-01-01',
        },

        {
          // 5
          unit_id: 193,
          rent: '$700',
          security_deposit: '$700',
          security_deposit_collected: '2018-09-28',

          start_date: '2018-10-01',
          end_date: '2019-10-01',

          deleted_at: '2019-10-02',
          notes: 'parent of 6?',
        },
        {
          // 6
          unit_id: 193,
          rent: '$710',

          start_date: '2019-10-01',
          end_date: '2020-10-01',

          parent_id: 5,
          balance: '$740',
          notes: 'child of 5?',
        },

        {
          // 7
          unit_id: 194,
          rent: '$720',
          start_date: '2020-04-01',
          end_date: '2021-04-01',
          balance: '$30',
        },
        {
          // 8
          unit_id: 200,
          rent: '$1000',
          start_date: '2018-02-01',
          end_date: '2019-02-01',
        },
      ])
    })
}
