const bcrypt = require("bcryptjs");
const router = require("express").Router();
const Users = require("./users-model.js");

router.get("/users", (req, res) => {
  Users.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("There was a problem getting the users");
    });
});

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  const rounds = process.env.HASH_ROUNDS || 8;
  const hash = bcrypt.hashSync(password, rounds);

  Users.add({ username, password: hash })
    .then(() => {
      req.session.loggedIn = true;
      res.status(201).send("New user created");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("There was a problem creating the user");
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.loggedIn = true;
        res.send("Welcome");
      } else res.status(401).send("You shall not pass");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("There was a problem logging in");
    });
});

router.post("/logout", (req, res) => {
  req.session.loggedIn = false;
  res.send("Logged out");
});

router.get("/", (req, res) => {
  res.json({ api: "running..." });
});

module.exports = router;
