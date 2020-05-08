import { pipeline } from 'stream'
import { from as copyFrom } from 'pg-copy-streams'
import * as Knex from 'knex'
import fs from 'fs'

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries

  return knex('unit')
    .del()
    .then(async () => {
      // Inserts seed entries
      await knex.transaction(async (tx) => {
        const fileStream = fs.createReadStream('./sql/columbiana_units.csv')
        await copyToTable(tx, 'unit', fileStream)
      })
    })
}

export async function copyToTable(trx: any, tableName, readableStream) {
  const knexClient = await (trx.trxClient || trx.client)
  const client = await knexClient.acquireConnection()

  var stream = client.query(
    copyFrom(`COPY ${tableName} FROM STDIN WITH (FORMAT csv, HEADER);`)
  )
  readableStream.on('error', (err) =>
    console.error('Error with readable stream:', err)
  )
  stream.on('error', (err) => console.error('Error with query stream:', err))
  stream.on('end', () => console.log('query stream end.'))
  readableStream.pipe(stream)

  //   pipeline(
  //     readableStream,
  //     pgClient.query(
  //       copyFrom(`COPY ${tableName} FROM STDIN WITH (FORMAT csv, HEADER);`)
  //     ),
  //     (err) => {
  //       if (err) {
  //         console.error('Pipeline failed', err)
  //       } else {
  //         console.log('Pipeline succeeded')
  //       }
  //     }
  //   )
  // } catch (e) {
  //   console.error(e)
  // }
}
