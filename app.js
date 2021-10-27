const http = require("http");
const { config } = require("./config");
const { logger } = require("./logger");

const env = config.ENV;
const port = config.APP_PORT;

http
  .createServer((req, res) => {
    console.log("New incoming request");
    res.writeHeader(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Hello world!" }));
  })
  .listen(port, () => {
    logger.log(`Server is listening on port ${port}. Env is ${env}.`);
  });
