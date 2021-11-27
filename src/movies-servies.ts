import logger from "./logger";
import { sortByField, paginate, generateId } from "./utils";
import { getOMDBMovie } from "./omdb-service";
import { moviesCatalogDB } from "./movies-db";
import { RequestWithUser, User } from "./auth-service";

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
    moviesCatalogDB.movies[id] = { ...data, comment, personalScore, id };
  } else {
    moviesCatalogDB.movies[id] = { name, comment, personalScore, id };
  }
  console.log(moviesCatalogDB.movies);
  res.send({ data: moviesCatalogDB.movies[id] });
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
  const movieToUpdate = { ...moviesCatalogDB.movies[id] };

  if (!movieToUpdate) {
    return res.send({ error: "Movie does not exist!" });
  }
  const comment: string = req.body.comment;
  const personalScore: number = req.body.personalScore;

  if (!comment && !personalScore) {
    return res.send({ message: "Nothing to update!" });
  }
  if (comment !== undefined) {
    moviesCatalogDB.movies[id] = { ...moviesCatalogDB.movies[id], comment };
  }
  if (personalScore !== undefined) {
    moviesCatalogDB.movies[id] = {
      ...moviesCatalogDB.movies[id],
      personalScore,
    };
  }
  console.log(moviesCatalogDB.movies);
  res.send({ data: moviesCatalogDB.movies[id] });
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
  if (!moviesCatalogDB.movies[id]) {
    return res.send({ error: "Movie does not exist!" });
  }
  delete moviesCatalogDB.movies[id];

  console.log(moviesCatalogDB.movies);
  res.send({ status: "success" });
};

export const getAllMovies = (req: RequestWithUser, res: any) => {
  logger.info({
    request_id: req.id,
    url: req.url,
    query: req.query,
    message: "get all movies",
  });

  const { sortBy, pageSize, pageNumber } = req.query;
  let moviesList = Object.values(moviesCatalogDB.movies);

  if (sortBy) {
    moviesList = sortByField(moviesList, sortBy);
  }
  if (pageSize && pageNumber) {
    moviesList = paginate(moviesList, pageSize, pageNumber);
  }
  if (!req.user) {
    return res.send({ movies: moviesList });
  }

  const user = moviesCatalogDB.users.find(
    (user: User) => user.name === req.user.name
  );
  if (!user) {
    return res.send({ error: "User not found!" });
  }
  return res.send({
    movies: moviesList,
    favMovies: Object.values(user.favMovies),
  });
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
  if (!moviesCatalogDB.movies[id]) {
    return res.send({ error: "Movie does not exist!" });
  }
  console.log(moviesCatalogDB.movies);
  res.send({ movie: moviesCatalogDB.movies[id] });
};

export const markFavourite = (req: any, res: any) => {
  logger.info({
    request_id: req.id,
    url: req.url,
    params: req.params,
    message: "mark movie as favourite",
  });

  const id: number = req.params.id;
  if (!id) {
    return res.send({ error: "Bad request!" });
  }

  const movieToMark = { ...moviesCatalogDB.movies[id] };
  if (!movieToMark) {
    return res.send({ error: "Movie does not exist!" });
  }

  const user = moviesCatalogDB.users.find(
    (user: User) => user.name === req.user.name
  );
  if (!user) {
    return res.send({ error: "User not found!" });
  }

  user.favMovies[movieToMark.id] = { ...movieToMark };

  console.log(user.favMovies);
  res.send({ data: user.favMovies[movieToMark.id] });
};
