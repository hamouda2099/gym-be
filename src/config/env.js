const env = require("../config").env;

// SERVER PORT
const serverPort = env.SERVER_PORT;

// JWTKey
const jwtKey = env.JWT_SECRET;

// DatabaseConnectionAuth
const host = env.DB_HOST,
  user = env.DB_USER,
  database = env.DB_NAME,
  password = env.DB_PASS,
  port = env.DB_PORT;

module.exports = {
  jwtKey,
  host,
  user,
  port,
  database,
  password,
  serverPort,
};
