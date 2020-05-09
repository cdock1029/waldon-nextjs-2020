import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  return knex.schema.raw(`
  CREATE TABLE "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
  )
  WITH (OIDS=FALSE);
  
  ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
  
  CREATE INDEX "IDX_session_expire" ON "session" ("expire"); 
  `)
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists('session')
}
