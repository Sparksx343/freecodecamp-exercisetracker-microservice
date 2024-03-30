module.exports = (app) => {
  const Nested = require("../models/NestedTest");
  app.get("/api/nested", (req, res) => {
    Nested.find()
      .then((elements) => {
        res.json({ message: "found nested documents", data: elements });
      })
      .catch((err) => res.status(400).json({ message: "error", data: err }));
  });
};
