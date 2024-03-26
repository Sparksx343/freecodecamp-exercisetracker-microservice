const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
var mongoose = require("mongoose");
const BodyParser = require("body-parser");

app.use(
  BodyParser.urlencoded({
    extended: false,
  })
);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
});

const exerciseSchema = new Schema({
  _id: { type: String, required: true },
  username: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  description: { type: String, required: true },
});

const logSchema = new Schema({
  _id: { type: String, required: true },
  count: { type: Number, required: true },
  username: { type: String, required: true },
  log: [
    {
      description: { type: String, required: true },
      duration: { type: Number, required: true },
      date: { type: String, required: true },
    },
  ],
});

let User = mongoose.model("User", userSchema);
let Exercise = mongoose.model("Exercise", exerciseSchema);
let Log = mongoose.model("Log", logSchema);

/* Example mongoose saving */
/* 
const createAndSavePerson = function (done) {
  const janeFonda = new Person({
    name: "Jane Fonda",
    age: 84,
    favoriteFoods: ["eggs", "fish", "fresh fruit"],
  });

  janeFonda.save(function (err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};
*/

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  const doc = new User({
    username: req.body.username,
  });
  doc.save();
  const data = doc.toObject();
  return res.json(data);
});

app.get("/api/users", (req, res) => {
  User.find({}, (err, documentos) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error al buscar usuarios" });
      return;
    }

    res.json(documentos);
  });
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  const valida_fecha = new Date(req.body.date);
  const _id = req.body[":_id"];
  let date;

  if (!isNaN(valida_fecha) && valida_fecha instanceof Date) {
    date =
      req.body.date.trim() !== ""
        ? new Date(req.body.date).toDateString()
        : new Date().toDateString();
  } else {
    date = new Date().toDateString();
  }
  const exercise = {
    _id,
    description: req.body.description,
    duration: parseFloat(req.body.duration),
    date,
  };
  const user = await User.findById(_id);
  if (!user) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

  exercise["username"] = user.username;

  const doc = new Exercise(exercise);
  await doc.save();
  const data = doc.toObject();
  res.json(data);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
