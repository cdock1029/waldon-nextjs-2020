import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  return knex.schema.raw(`
  CREATE or replace FUNCTION wpm_pay_balance(lease_id integer, date date default now()) RETURNS BOOLEAN
    LANGUAGE plpgsql
    AS $$
  DECLARE
    _id integer;
    _date date;
  BEGIN
    _id := lease_id;
    _date := date;

    with l as (
      select * from lease where id = _id
    )
    insert into transaction (date, amount, type, lease_id, notes)
    select _date, (-1 * l.balance), 'payment', _id, 'Pay off balance' from l;

  RETURN true;
  END;
  $$;

  CREATE or replace FUNCTION wpm_pay_rent(lease_id integer, date date default now()) RETURNS BOOLEAN
    LANGUAGE plpgsql
    AS $$
  DECLARE
    _id integer;
    _date date;
  BEGIN
    _id := lease_id;
    _date := date;

    with l as (
      select * from lease where id = _id
    )
    insert into transaction (date, amount, type, lease_id, notes)
    select _date, (-1 * l.rent), 'payment', _id, 'Pay rent' from l;

  RETURN true;
  END;
  $$;

  `)
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.raw(`
  drop function if exists wpm_pay_balance;
  drop function if exists wpm_pay_rent;
  `)
}
