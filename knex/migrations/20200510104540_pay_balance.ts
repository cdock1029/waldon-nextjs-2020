import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  return knex.schema.raw(`
  CREATE or replace FUNCTION wpm_pay_balance(_id integer, _time timestamp default now()) RETURNS int
    AS $$

    with l as (
      select * from lease where id = _id
    )
    insert into transaction (date, amount, type, lease_id, notes)
    select _time, (-1 * l.balance), 'payment', _id, 'Pay off balance' from l
    returning transaction.id;

  $$ LANGUAGE SQL;

  CREATE or replace FUNCTION wpm_pay_rent(_id integer, _time timestamp default now()) RETURNS int
    AS $$

    with l as (
      select * from lease where id = _id
    )
    insert into transaction (date, amount, type, lease_id, notes)
    select _time, (-1 * l.rent), 'payment', _id, 'Pay rent' from l
    returning transaction.id;

  $$ LANGUAGE SQL;
  `)
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.raw(`
  drop function if exists wpm_pay_balance;
  drop function if exists wpm_pay_rent;
  `)
}
