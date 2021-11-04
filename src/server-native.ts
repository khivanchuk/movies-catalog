import { createServer, IncomingMessage, ServerResponse } from "http";
import { createReadStream } from "fs";
import { config } from "./config";

const env = config.ENV;
const port = config.APP_PORT;

createServer((req: IncomingMessage, res: ServerResponse) => {
  if (req.method === "GET") {
    var readStream = createReadStream("data.json");

    readStream.on("open", () => {
      readStream.pipe(res);
    });
  } else if (req.method === "POST") {
    const chunks: Buffer[] = [];
    let body: Record<string, unknown> | null = null;

    req
      .on("data", (data) => {
        chunks.push(data);
      })
      .on("end", () => {
        const rawBody = Buffer.concat(chunks).toString();
        body = JSON.parse(rawBody);
        console.log(body);
        console.log(chunks.length);
        res.end(rawBody);
      });
  }
}).listen(port, () => {
  console.log(`Server is listening on port ${port}. Env is ${env}.`);
});
