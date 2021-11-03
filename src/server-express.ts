import express from "express";
import { createReadStream } from "fs";

const app = express();
const port = 3000;
const HTTP_SERVER_ERROR = 500;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req: any, res: any, next: (arg?: any) => void) => {
  res.header("Content-Type", "application/json");
  next();
});

app.get("/", (req, res) => {
  const readStream = createReadStream("data.json");

  readStream.on("open", () => {
    readStream.pipe(res);
  });
});

app.post("/", (req, res) => {
  const body = req.body;
  console.log(body);
  res.send(body);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}.`);
});

process.on("uncaughtException", (err, origin) => {
  console.error(err);
  console.log(origin);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(reason);
  console.log(promise);
});
