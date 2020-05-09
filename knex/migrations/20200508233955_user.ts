import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  return knex.schema.raw(`

  create table wpm_user (
    id serial primary key,
    username citext not null unique check(trim(username) = username),
    email citext not null unique check(trim(username) = username),
    password_digest text not null,

    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
  );
  CREATE TRIGGER wpm_user_update BEFORE UPDATE ON wpm_user FOR EACH ROW EXECUTE procedure wpm_set_current_timestamp_updated_at();


  `)
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists('wpm_user')
}
