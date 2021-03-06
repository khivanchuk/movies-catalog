import express from "express";
import { STATUS_CODES } from "http";
import expressPinoLogger from "express-pino-logger";
import logger from "./logger";
import {
  addMovie,
  updateMovie,
  deleteMovie,
  getAllMovies,
  getMovie,
  markFavourite,
} from "./movies-servies";
import { authRouter, authMiddleware, authOnly } from "./auth-service";

const app = express();
const port = 3000;

const loggerMiddleware = expressPinoLogger({
  logger: logger,
  useLevel: "http",
});

const errorHandler = (
  err: { message: any },
  req: any,
  res: any,
  next: (arg?: any) => void
) => {
  logger.error({
    request_id: req.id,
    url: req.url,
    params: req.params,
    body: req.body,
    message: err.message,
  });
  res.status(500).send({ error: STATUS_CODES[500] });
  next();
};

app.use(express.json());

app.use(loggerMiddleware);
app.use(authMiddleware);

app.use("/auth", authRouter);

app.post("/movies", authOnly, addMovie);

app.patch("/movies/:id", authOnly, updateMovie);

app.delete("/movies/:id", authOnly, deleteMovie);

app.get("/movies", getAllMovies);

app.get("/movies/:id", getMovie);

app.post("/markFavourite/:id", authOnly, markFavourite);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}.`);
});

process.on("uncaughtException", (err, origin) => {
  logger.error({ message: "uncaughtException happened", origin });
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error({ message: "unhandledRejection happened", promise });
});
