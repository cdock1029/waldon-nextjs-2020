import * as Knex from 'knex'
const columbianaUnits = require('../sql/columbiana_unit')
const newtonCommonsUnits = require('../sql/newton_commons_units_partial')

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex('unit')
    .del()
    .then(async () => {
      // Inserts seed entries
      await knex('unit').insert(columbianaUnits)
      await knex('unit').insert(newtonCommonsUnits)
    })
}
