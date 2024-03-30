module.exports = (app) => {
  const Exercise = require("../models/Exercise");
  const User = require("../models/User");

  app.get("/api/users/:_id/logs", (req, res) => {
    const idUser = req.params._id;

    const from = req.query.from || 0;
    const to = req.query.to || Date.now();
    const limit = req.query.limit;

    User.findById(idUser)
      .then((user) => {
        if (!user)
          res.status(404).json({ error: `No user found with id:${idUser}` });

        return Exercise.find({ username: user.username })
          .select({ _id: 0, description: 1, duration: 1, date: 1 })
          .sort({ date: -1 })
          .limit(limit)
          .where("date")
          .gte(from)
          .lte(to)
          .exec()
          .then((exercises) => {
            if (!exercises)
              res
                .status(404)
                .json({ error: `No exercises found for ${user.username}` });

            res.json({
              _id: idUser,
              username: user.username,
              count: exercises.length,
              log: exercises,
            });
          });
      })
      .catch((err) =>
        res.status(500).json({ error: "Server Error. Please try later." })
      );
  });
};
