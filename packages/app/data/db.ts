import connect from '@databases/pg'

const db = connect(process.env.DATABASE_URL, {
  noDuplicateDatabaseObjectsWarning: process.env.NODE_ENV !== 'production',
})

export default db
