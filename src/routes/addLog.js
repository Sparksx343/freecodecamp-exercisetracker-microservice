module.exports = (app) => {
  const Exercise = require("../models/Exercise");
  const User = require("../models/User");

  app.post("/api/users/:_id/exercises", (req, res) => {
    const idUser = req.params._id;

    User.findById(idUser)
      .then((user) => {
        if (!user) res.status(404).json("No user found.");

        const newLog = new Exercise({
          username: user.username,
          description: req.body.description,
          duration: Number(req.body.duration),
          date: req.body.date ? Date.parse(req.body.date) : Date.now(),
        });

        return newLog.save().then((log) => {
          if (!log) res.status(404).json("No log created.");

          res.json({
            _id: user._id,
            username: user.username,
            description: log.description,
            duration: log.duration,
            date: log.date,
          });
        });
      })
      .catch((err) =>
        res
          .status(500)
          .json({ error: "Server Error. Please try later.", data: err })
      );
  });
};
