import type Knex from 'knex'

exports.up = function (knex: Knex) {
  return knex.schema.raw(`
  create table lease_tenant (
    lease_id integer not null references lease(id) on delete cascade,
    tenant_id integer not null references tenant(id) on delete cascade,
    primary key (lease_id, tenant_id)
  );

  create index wpm_lease_tenant_lid_idx on lease_tenant(lease_id);
  create index wpm_lease_tenant_tid_idx on lease_tenant(tenant_id);
  `)
}

exports.down = function (knex: Knex) {
  return knex.schema.dropTableIfExists('lease_tenant')
}
