import express from "express";
import jsonwebtoken, { Algorithm, SignOptions, JwtPayload } from "jsonwebtoken";
import fs from "fs";
import { moviesCatalogDB } from "./movies-db";
import bcrypt from "bcrypt";

const privateKey = fs.readFileSync("private.key");
const publicKey = fs.readFileSync("public.key");

const algorithm: Algorithm = "RS256";
const options: SignOptions = {
  issuer: "Movies Catalog",
  algorithm: "RS256" as Algorithm,
};

const encrypt = (data: any) =>
  jsonwebtoken.sign({ payload: data }, privateKey, options);

const decrypt = (token: any) =>
  (jsonwebtoken.verify(token, publicKey, options) as JwtPayload).payload;

const hashedPassword = (pass: any) => bcrypt.hashSync(pass, 10);

const checkPassword = (pass: any, hash: any) => bcrypt.compareSync(pass, hash);

export interface User {
  name: string;
  pass: string;
  role?: string;
}

export type RequestWithUser = express.Request & { user: User };

export const authRouter = express.Router();

authRouter.post("/registration", (req: any, res: any) => {
  const { name, pass } = req.body;
  const user = moviesCatalogDB.users.find((user: User) => user.name === name);
  if (user) {
    return res.send({ error: "User with such name already exists!" });
  }
  const hashedPass = hashedPassword(pass);

  moviesCatalogDB.users.push({
    name,
    pass: hashedPass,
    role: "user",
    favMovies: {},
  });
  console.log(moviesCatalogDB.users);
  res.status(201).end();
});

authRouter.post("/login", (req: any, res: any) => {
  const { name, pass } = req.body;
  const user = moviesCatalogDB.users.find(
    (user: User) => user.name === name && checkPassword(pass, user.pass)
  );
  if (!user) {
    return res.send({ error: "User not found!" });
  }
  const token = encrypt({ name: user.name, role: user.role });
  res.json({ token: token }).end();
});

export const authOnly = (req: RequestWithUser, res: any, next: any) => {
  if (!req.user) {
    res.json({ error: "User not authorized" }).status(404);
    return;
  }
  next();
};

export const authMiddleware = (req: RequestWithUser, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    next();
    return;
  }
  try {
    const token = authHeader.split(" ")[1];
    const tokenData = decrypt(token);
    const user = moviesCatalogDB.users.find(
      (user: User) => user.name === tokenData.name
    );

    req.user = user;
  } catch (error) {
    console.log(error);
  } finally {
    next();
  }
};
