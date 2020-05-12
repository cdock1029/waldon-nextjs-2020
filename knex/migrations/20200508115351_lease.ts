import type Knex from 'knex'

exports.up = function (knex: Knex) {
  return knex.schema.raw(`
  create table lease (
    id serial primary key,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    deleted_at timestamp,

    evicted_at timestamp check(evicted_at::date <@ span),

    rent money not null check(rent > 0::money),
    balance money not null default 0::money,

    security_deposit money not null default 0::money,
    security_deposit_collected timestamp,
    security_deposit_returned timestamp check(security_deposit_returned >= security_deposit_collected),

    start_date timestamp not null,
    end_date timestamp not null check(end_date > start_date),
    span daterange generated always as (daterange(start_date::date, end_date::date)) stored,

    parent_id integer references lease(id),

    unit_id integer not null references unit(id) on delete cascade,

    notes text,

    -- no overlapping lease dates for a unit if not evicted or 'deleted'
    exclude using gist (
      unit_id with =,
      span with &&
    ) where (deleted_at is null AND evicted_at is null)
  );
  CREATE TRIGGER wpm_lease_update BEFORE UPDATE ON lease FOR EACH ROW EXECUTE procedure wpm_set_current_timestamp_updated_at();

  -- use for querying active leases, even with daterange in past
  create index wpm_lease_daterange_active_idx on lease(span) where deleted_at is null;
  create index wpm_lease_unit_idx on lease(unit_id, end_date desc nulls last);

  -- index leases that have parents (extended leases)
  create index wpm_lease_parent_idx on lease(parent_id) where parent_id is not null;

  create index wpm_lease_created on lease(created_at desc);
  create index wpm_lease_updated on lease(updated_at desc);

  create index wpm_lease_evicted on lease(evicted_at desc) where evicted_at is not null;
  `)
}

exports.down = function (knex: Knex) {
  return knex.schema.dropTableIfExists('lease')
}
