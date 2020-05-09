import * as Knex from 'knex'
const tenantSeed = require('../sql/tenants')

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex('tenant')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('tenant').insert(tenantSeed)
    })
}
