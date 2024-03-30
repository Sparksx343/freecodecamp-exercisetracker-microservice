const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const mg = require("./src/mongoose/mongoose");

app
  .use(cors())
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// POST /api/users/:_id/exercises
require("./src/routes/addLog")(app);

// GET /api/users/:_id/logs
require("./src/routes/getLogs")(app);

// GET /api/users
require("./src/routes/getUsers")(app);

// POST /api/users
require("./src/routes/addUser")(app);

require("./src/routes/addTest")(app);
require("./src/routes/getTest")(app);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
