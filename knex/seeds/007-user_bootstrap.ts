import * as Knex from 'knex'

export async function seed(knex: Knex): Promise<any> {
  return knex('allowed_user')
    .del()
    .then(() => {
      return knex('allowed_user').insert([{ username: 'cdock' }])
    })
}
