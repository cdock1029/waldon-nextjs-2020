import * as Knex from 'knex'

export async function seed(knex: Knex): Promise<any> {
  return knex('transactions')
    .del()
    .then(() => {
      return knex('transactions').insert([])
    })
}
