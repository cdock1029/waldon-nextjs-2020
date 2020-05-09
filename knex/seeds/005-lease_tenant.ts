import * as Knex from 'knex'

export async function seed(knex: Knex): Promise<any> {
  return knex('lease_tenant')
    .del()
    .then(() => {
      return knex('lease_tenant').insert([
        {
          lease_id: 1,
          tenant_id: 9, //bill brasky
        },
        {
          lease_id: 2,
          tenant_id: 4, //mona
        },
        {
          lease_id: 2,
          tenant_id: 5, //saoirse
        },
        {
          lease_id: 3,
          tenant_id: 7, //huck
        },
        {
          lease_id: 4,
          tenant_id: 8, //me
        },
        {
          lease_id: 5,
          tenant_id: 6, //amanda
        },
        {
          lease_id: 6,
          tenant_id: 6, //amanda
        },
        {
          lease_id: 7,
          tenant_id: 11, //mitsy
        },
        {
          lease_id: 8,
          tenant_id: 7, //huck
        },
      ])
    })
}
