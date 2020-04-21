const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const cors = require("cors");
const server = express();
const KnexSessionStore = require("connect-session-knex")(session);

const router = require("./api");
const db = require("./db-config");

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
server.use("/api/users", validateSession);
server.use("/api", router);
server.use(errorHandler);

module.exports = server;

function validateSession(req, res, next) {
  console.log(req.sessionID);
  console.log(req.session);
  if (!req.session.loggedIn) {
    return next({ code: 401, message: "You shall not pass!!!" });
  }
  next();
}

function errorHandler(err, req, res, next) {
  res.status(err.code).send(err.message);
}
