import type Knex from 'knex'

exports.up = async function (knex: Knex) {
  await knex.schema.raw(`

  CREATE EXTENSION IF not exists citext;
  CREATE EXTENSION if not exists btree_gist;

  CREATE FUNCTION set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  DECLARE
    _new record;
  BEGIN
    _new := NEW;
    _new."updated_at" = NOW();
  RETURN _new;
  END;
  $$;

  `)
}

exports.down = function (knex: Knex) {
  return knex.schema.raw(`
  drop extension citext;
  drop extension btree_gist;
  drop function if exists set_current_timestamp_updated_at;
  `)
}
