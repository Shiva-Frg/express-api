const pgp = require('pg-promise')()
const connectionString =
  'postgresql://postgres:P@ssW0rd@localhost:5432/burger_house'

const db = pgp(connectionString)

module.exports = db
