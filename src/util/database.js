const env = require("../config/env");
const sql = require("mysql2");

const pool = sql.createPool({
  host: env.host,
  user: env.user,
  database: env.database,
  password: env.password,
});

module.exports = pool.promise();
