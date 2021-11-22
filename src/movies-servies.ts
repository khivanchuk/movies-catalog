import logger from "./logger";
import { sortByField, paginate, generateId } from "./utils";
import { getOMDBMovie } from "./omdb-service";

const moviesDB: any = {};

export const addMovie = async (req: any, res: any) => {
  logger.info({
    request_id: req.id,
    url: req.url,
    body: req.body,
    message: "add movie",
  });

  const name: string = req.body.name;

  if (!name) {
    return res.send({ error: "Name is required!" });
  }
  const { status, data }: any = await getOMDBMovie(name);
  const id: string = generateId();
  const comment: string = req.body.comment || null;
  const personalScore: number = req.body.personalScore || null;

  if (status === 200 && !data.Error) {
    moviesDB[id] = { ...data, comment, personalScore, id };
  } else {
    moviesDB[id] = { name, comment, personalScore, id };
  }
  console.log(moviesDB);
  res.send({ data: moviesDB[id] });
};

export const updateMovie = (req: any, res: any) => {
  logger.info({
    request_id: req.id,
    url: req.url,
    params: req.params,
    body: req.body,
    message: "update movie",
  });

  const id: number = req.params.id;

  if (!id) {
    return res.send({ error: "Bad request!" });
  }
  const movieToUpdate = { ...moviesDB[id] };

  if (!movieToUpdate) {
    return res.send({ error: "Movie does not exist!" });
  }
  const comment: string = req.body.comment;
  const personalScore: number = req.body.personalScore;

  if (!comment && !personalScore) {
    return res.send({ message: "Nothing to update!" });
  }
  if (comment !== undefined) {
    moviesDB[id] = { ...moviesDB[id], comment };
  }
  if (personalScore !== undefined) {
    moviesDB[id] = { ...moviesDB[id], personalScore };
  }
  console.log(moviesDB);
  res.send({ data: moviesDB[id] });
};

export const deleteMovie = (req: any, res: any) => {
  logger.info({
    request_id: req.id,
    url: req.url,
    params: req.params,
    message: "delete movie",
  });

  const id: number = req.params.id;

  if (!id) {
    return res.send({ error: "Bad request!" });
  }
  if (!moviesDB[id]) {
    return res.send({ error: "Movie does not exist!" });
  }
  delete moviesDB[id];

  console.log(moviesDB);
  res.send({ status: "success" });
};

export const getAllMovies = (req: any, res: any) => {
  logger.info({
    request_id: req.id,
    url: req.url,
    query: req.query,
    message: "get all movies",
  });

  const { sortBy, pageSize, pageNumber } = req.query;
  let moviesList = Object.values(moviesDB);

  if (sortBy) {
    moviesList = sortByField(moviesList, sortBy);
  }
  if (pageSize && pageNumber) {
    moviesList = paginate(moviesList, pageSize, pageNumber);
  }
  res.send({ movies: moviesList });
};

export const getMovie = (req: any, res: any) => {
  logger.info({
    request_id: req.id,
    url: req.url,
    params: req.params,
    message: "get movie",
  });

  const id: number = req.params.id;

  if (!id) {
    return res.send({ error: "Bad request!" });
  }
  if (!moviesDB[id]) {
    return res.send({ error: "Movie does not exist!" });
  }
  console.log(moviesDB);
  res.send({ movie: moviesDB[id] });
};
