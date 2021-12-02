const pgp = require('pg-promise')()
const connectionString = 'postgresql://postgres:P@ssW0rd@localhost:5432/test'

const db = pgp(connectionString)

module.exports = db
