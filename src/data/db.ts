import connect from '@databases/pg'

let globalAny: any = global

globalAny.db =
  globalAny.db || connect(process.env.DATABASE_URL, { poolSize: 2 })

export default globalAny.db
