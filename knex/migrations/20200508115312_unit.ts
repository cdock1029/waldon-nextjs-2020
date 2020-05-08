import type Knex from 'knex'

exports.up = function (knex: Knex) {
  return knex.schema.raw(`
  create table unit (
    id serial primary key,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),

    name citext not null,
    property_id integer not null references property(id) on delete cascade,

    unique(property_id, name)
  );

  CREATE TRIGGER wpm_unit_update BEFORE UPDATE ON unit FOR EACH ROW EXECUTE procedure wpm_set_current_timestamp_updated_at();
  CREATE INDEX wpm_unit_property_name on unit (property_id, name);

  create index wpm_unit_created on unit(created_at desc);
  create index wpm_unit_updated on unit(updated_at desc);
  `)
}

exports.down = function (knex: Knex) {
  return knex.schema.dropTableIfExists('unit')
}
