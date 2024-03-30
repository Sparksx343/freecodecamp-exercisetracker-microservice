module.exports = (app) => {
  const Nested = require("../models/NestedTest");
  app.post("/api/nested", (req, res) => {
    const nested = new Nested(req.body);

    nested
      .save()
      .then((element) => {
        res.json({ message: "nested has been created", data: element });
      })
      .catch((err) => res.status(400).json({ message: "error", data: err }));
  });
};
