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
  description: { type: String },
  duration: { type: Number },
  date: { type: String },
  count: { type: Number },
  log: { type: [Object] },
});

let User = mongoose.model("User", userSchema);

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  const doc = new User({
    username: req.body.username,
    count: 0,
    log: [],
  });
  doc.save();
  const data = doc.toObject();
  const { _id, username } = data;
  const filtered = { _id, username };
  return res.json(filtered);
});

app.get("/api/users", (req, res) => {
  User.find({}, (err, documentos) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error al buscar usuarios" });
      return;
    }
    res.json(documentos);
  }).select("_id username");
});

app.post("/api/users/:_id/exercises", (req, res) => {
  try {
    const valida_fecha = new Date(req.body.date);
    const _id = req.body[":_id"];
    const description = req.body.description;
    const duration = parseFloat(req.body.duration);
    let date;

    if (!isNaN(valida_fecha) && valida_fecha instanceof Date) {
      date =
        req.body.date.trim() !== ""
          ? new Date(req.body.date).toDateString()
          : new Date().toDateString();
    } else {
      date = new Date().toDateString();
    }
    const user = User.findById(_id, (err, user) => {
      if (err) {
        console.log(err);
        return;
      }
      user.description = description;
      user.duration = duration;
      user.date = date;
      user.save();
    });
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    res.json(user);
  } catch (error) {
    return res.json(error);
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
