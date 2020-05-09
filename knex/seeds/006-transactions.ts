import * as Knex from 'knex'

export async function seed(knex: Knex): Promise<any> {
  return knex('transaction')
    .del()
    .then(() => {
      return knex('transaction').insert([])
    })
}
