const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
var moment = require("moment");
var mongoose = require("mongoose");
const BodyParser = require("body-parser");

app.use(BodyParser.json());
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
  username: { type: String, required: true },
  user_id: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: String, required: true },
});

let User = mongoose.model("User", userSchema);
let Exercise = mongoose.model("Exercise", exerciseSchema);

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
  const { _id, username } = data;
  const filtered = { _id, username };
  return res.status(201).json(filtered);
});

app.get("/api/users", (req, res) => {
  User.find({}, (err, documentos) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error al buscar usuarios" });
      return;
    }
    res.status(200).json(documentos);
  }).select("_id username");
});

app.post("/api/users/:_id/exercises", (req, res) => {
  try {
    const inputDate = req.body.date.trim();
    const _id = req.body[":_id"] ?? req.params._id;
    const description = req.body.description;
    const duration = parseInt(req.body.duration);
    let date;

    if (inputDate == "") {
      date = moment().format("YYYY-MM-DD");
    } else {
      date = moment(inputDate).format("YYYY-MM-DD");
    }
    User.findById(_id, (err, userDb) => {
      if (err) {
        console.error(err);
        res.status(400).json({ msg: "Invalid User ID" });
      }
      const newExercise = new Exercise({
        user_id: userDb._id,
        username: userDb.username,
        description,
        duration,
        date,
      });
      newExercise.save((err, exercise) => {
        if (err) {
          console.error("Cant save new exercise");
          res.status(500).json({ msg: "Exercise creation failed" });
        }
        res.status(201).json({
          username: userDb.username,
          description: exercise.description,
          duration: exercise.duration,
          date: moment(date).format("ddd MMM DD YYYY"),
          _id,
        });
      });
    });
  } catch (error) {
    return res.json(error);
  }
});

app.get("/api/users/:_id/logs", async (req, res) => {
  const userId = req.params._id;
  const from = req.query.from || new Date(0).toISOString().substring(0, 10);
  const to =
    req.query.to || new Date(Date.now()).toISOString().substring(0, 10);
  const limit = Number(req.query.limit) || 0;

  let user = await User.findById(userId).exec();

  let exercises = await Exercise.find({
    user_id: userId,
    date: { $gte: from, $lte: to },
  })
    .select("description duration date")
    .limit(limit)
    .exec();

  let parsedDatesLog = exercises.map((exercise) => {
    return {
      description: exercise.description,
      duration: exercise.duration,
      date: moment(exercise.date).format("ddd MMM DD YYYY"),
    };
  });

  res.json({
    _id: user._id,
    username: user.username,
    count: parsedDatesLog.length,
    log: parsedDatesLog,
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
