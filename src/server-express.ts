import express from "express";
import expressPinoLogger from "express-pino-logger";
import logger from "./logger";
import { createReadStream } from "fs";

const app = express();
const port = 3000;
const HTTP_SERVER_ERROR = 500;
const loggerMiddleware = expressPinoLogger({
  logger: logger,
  useLevel: "http",
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req: any, res: any, next: (arg?: any) => void) => {
  res.header("Content-Type", "application/json");
  next();
});
app.use(loggerMiddleware);

app.get("/", (req, res) => {
  logger.info({
    request_id: req.id,
    url: req.url,
    params: req.params,
    message: "get request info",
  });

  const readStream = createReadStream("data.json");

  readStream.on("open", () => {
    readStream.pipe(res);
  });
});

app.post("/", (req, res) => {
  logger.info({
    request_id: req.id,
    url: req.url,
    params: req.params,
    message: "post request info",
  });

  const body = req.body;
  console.log(body);
  res.send(body);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}.`);
});

process.on("uncaughtException", (err, origin) => {
  logger.error({ message: "uncaughtException happened", origin });
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error({ message: "unhandledRejection happened", promise });
});
