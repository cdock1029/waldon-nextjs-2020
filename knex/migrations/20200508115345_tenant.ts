import type Knex from 'knex'
exports.up = function (knex: Knex) {
  return knex.schema.raw(`
  create table tenant (
    id serial primary key,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    deleted_at timestamp,

    first_name citext not null check (trim(first_name) <> '' AND trim(first_name) = first_name),
    last_name citext not null check (trim(last_name) <> '' AND trim(last_name) = last_name),
    middle_name citext check(trim(middle_name) = middle_name),
    suffix citext check(trim(suffix) = suffix),
    email citext unique check (trim(email) <> '' AND trim(email) = email),

    full_name citext generated always as (
      first_name || ' '
      || COALESCE(middle_name || ' ', '')
      || last_name
      || COALESCE(' ' || suffix, '')
    ) stored,

    notes citext,

    unique(full_name)

  );
  CREATE TRIGGER wpm_tenant_update BEFORE UPDATE ON tenant FOR EACH ROW EXECUTE procedure wpm_set_current_timestamp_updated_at();

  create index wpm_tenant_last_first_active on tenant(last_name, first_name) where deleted_at is null;
  create index wpm_tenant_last_all on tenant(last_name);
  create index wpm_tenant_last_name on tenant(last_name);

  create index wpm_tenant_created on tenant(created_at desc);
  create index wpm_tenant_updated on tenant(updated_at desc);
  `)
}

exports.down = function (knex: Knex) {
  return knex.schema.dropTableIfExists('tenant')
}
