import pino from "pino";

const levels = {
  http: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

const logger = pino(
  {
    customLevels: levels,
    useOnlyCustomLevels: true,
    level: "http",
  },
  pino.destination(`${__dirname}/logger.log`)
);

export default logger;
