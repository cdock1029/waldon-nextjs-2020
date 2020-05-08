import type Knex from 'knex'

// @todo: look into constraint limiting 1 late_fee per month, creating other fee type etc
// @todo: think about lease indexes, deleted_at (inactive) or not, cascade etc.
exports.up = function (knex: Knex) {
  return knex.schema.raw(`

  CREATE TYPE txn_type AS ENUM (
    'payment',
    'rent',
    'late_fee'
  );

  create table transaction (
    id serial primary key,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    deleted_at timestamp,

    date date not null default now(),
    amount money not null check(
      type = 'rent'::txn_type AND amount > 0::money OR
      type = 'late_fee'::txn_type AND amount > 0::money OR
      type = 'payment'::txn_type AND amount < 0::money
    ),
    lease_id integer not null references lease(id) on delete cascade,
    type txn_type not null,
    memo text check(trim(memo) = memo),

    exclude using gist (
      amount with =,
      type with =,
      date with =,
      memo with = 
    ) where (deleted_at is null)
  );
  create index wpm_txn_created on transaction(created_at desc);
  create index wpm_txn_updated on transaction(updated_at desc);

  -- per lease partitioned
  create index wpm_txn_lease_idx on transaction (lease_id, date desc);
  -- total date ordered
  create index wpm_txn_date on transaction (date desc, updated_at desc);
  -- type partitioned, date ordered
  create index wpm_txn_type_date on transaction (type, date desc);

  CREATE TRIGGER transaction_update BEFORE UPDATE ON transaction FOR EACH ROW EXECUTE procedure set_current_timestamp_updated_at();

  CREATE FUNCTION add_txn_to_lease_balance()
    RETURNS trigger
    LANGUAGE 'plpgsql'
  AS $BODY$
  BEGIN

  IF (TG_OP = 'INSERT') THEN
      
      UPDATE lease
      set balance = balance + NEW.amount
      where id = NEW.lease_id;
    
  ELSIF (TG_OP = 'DELETE') THEN
    
      UPDATE lease
      set balance = balance - OLD.amount
      where id = OLD.lease_id;
    
  ELSIF (TG_OP = 'UPDATE') THEN
    
      UPDATE lease
      set balance = balance - OLD.amount + NEW.amount
      where id = OLD.lease_id;
  
  END IF;
    
    RETURN NULL;

  END
  $BODY$;

  CREATE TRIGGER add_txn_to_balance
    AFTER INSERT OR DELETE OR UPDATE 
    ON transaction
    FOR EACH ROW
    EXECUTE PROCEDURE add_txn_to_lease_balance();

  `)
}

exports.down = async function (knex: Knex) {
  // enum
  await knex.schema.raw('drop type txn_type;')
  return knex.schema.dropTableIfExists('transactions')
}
