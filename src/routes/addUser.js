module.exports = (app) => {
  const User = require("../models/User");

  app.post("/api/users", (req, res) => {
    const username = req.body.username;

    const newUser = new User({ username });

    newUser
      .save()
      .then((data) => {
        if (!data) res.status(404).json({ error: "No user found." });
        res.json(data);
      })
      .catch((err) =>
        res
          .status(500)
          .json({ error: "Server Error. Please try later.", data: err })
      );
  });
};
