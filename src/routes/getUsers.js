module.exports = (app) => {
  const User = require("../models/User");

  app.get("/api/users", (req, res) => {
    User.find()
      .then((data) => {
        if (!data) res.status(404).json({ error: "Nousers found." });
        res.json(data);
      })
      .catch((err) =>
        res
          .status(500)
          .json({ error: "Server Error. Please try later.", data: err })
      );
  });
};
