import type Knex from 'knex'

exports.up = function (knex: Knex) {
  return knex.schema.raw(`
  create table lease (
    id serial primary key,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    deleted_at timestamp,

    rent money not null check(rent > 0::money),
    balance money not null default 0::money,

    security_deposit money not null default 0::money,
    security_deposit_collected date,
    security_deposit_returned date check(security_deposit_returned >= security_deposit_collected),

    start_date date not null,
    end_date date not null check(end_date > start_date),

    parent_id integer references lease(id),

    unit_id integer not null references unit(id),

    -- no overlapping lease dates for a unit
    exclude using gist (
      unit_id with =,
      daterange(start_date, end_date) with &&
    ) where (deleted_at is null)
  );
  CREATE TRIGGER lease_update BEFORE UPDATE ON lease FOR EACH ROW EXECUTE procedure set_current_timestamp_updated_at();

  -- use for querying active leases, even with daterange in past
  create index wpm_lease_daterange_active_idx on lease(daterange(start_date, end_date)) where deleted_at is null;
  create index wpm_lease_unit_idx on lease(unit_id, end_date desc nulls last);

  create index wpm_lease_created on lease(created_at desc);
  create index wpm_lease_updated on lease(updated_at desc);
  `)
}

exports.down = function (knex: Knex) {
  return knex.schema.dropTableIfExists('lease')
}
