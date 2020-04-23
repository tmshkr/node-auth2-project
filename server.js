const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const server = express();
const KnexSessionStore = require("connect-session-knex")(session);

const router = require("./api");
const db = require("./db-config");
const secrets = require("./secrets");

const sessionConfig = {
  name: "reresh-token",
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: process.env.SEND_COOKIES || true,
  cookie: {
    maxAge: 600000, // 10 minutes
    secure: process.env.USE_SECURE_COOKIES || false, // used over https only
    httpOnly: true, // javascript on client can't access cookie
  },
  store: new KnexSessionStore({
    knex: db,
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 60, // will remove expired sessions every hour
  }),
};

server.use(helmet());
server.use(cors({ credentials: true, origin: "http://localhost:3000" }));
server.use(express.json());
server.use(session(sessionConfig));
server.use("/api/users", validateJWT);
server.use("/api", router);
server.use(errorHandler);

module.exports = server;

function validateJWT(req, res, next) {
  console.log(req.headers);
  try {
    const token = req.headers.authorization.split(" ")[1];
    req.user = jwt.verify(token, secrets.jwtSecret);
    console.log(req.user);
    next();
  } catch (err) {
    console.error(err);
    next({ code: 401, message: "Invalid token" });
  }
}

function errorHandler(err, req, res, next) {
  res.status(err.code).send(err.message);
}
