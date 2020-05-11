import type Knex from 'knex'

exports.up = async function (knex: Knex) {
  await knex.schema.raw(`

  CREATE EXTENSION IF not exists citext;
  CREATE EXTENSION if not exists btree_gist;

  CREATE or replace FUNCTION wpm_set_current_timestamp_updated_at() RETURNS trigger
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
  drop function if exists wpm_set_current_timestamp_updated_at;
  `)
}
