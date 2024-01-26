const http = require("http");
const app = require("./app");
const env = require("./src/config/env");

const server = http.createServer(app.app);
server.listen(env.serverPort);
