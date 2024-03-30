const mg = require("mongoose");

const nestedTestSchema = new mg.Schema({
  name: { type: String, required: true },
  infos: [
    {
      book: { type: String, require: true },
      price: { type: Number },
    },
  ],
});

const nestedTest = mg.model("nestedTest", nestedTestSchema);

module.exports = nestedTest;
