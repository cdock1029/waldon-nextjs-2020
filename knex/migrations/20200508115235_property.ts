import type Knex from 'knex'

exports.up = async function (knex: Knex) {
  return knex.schema.raw(`
  create table property (
    id serial primary key,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    name citext not null unique
  );
  CREATE TRIGGER property_update BEFORE UPDATE ON property FOR EACH ROW EXECUTE procedure set_current_timestamp_updated_at();

  create index wpm_property_created on property(created_at desc);
  create index wpm_property_updated on property(updated_at desc);
  `)
}

exports.down = async function (knex: Knex) {
  return knex.schema.dropTableIfExists('property')
}
