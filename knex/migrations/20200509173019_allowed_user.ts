import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  return knex.schema.raw(`
  create table allowed_user (
    username citext primary key
  );
  `)
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists('allowed_user')
}
