const mg = require("mongoose");

const exerciseSchema = mg.Schema({
  username: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true, min: 0 },
  date: {
    type: Date,
    required: true,
    get: (date) => {
      return new Date(date).toDateString();
    },
  },
});

exerciseSchema.set("toObject", { getters: true });
exerciseSchema.set("toJSON", { getters: true });

exerciseSchema.options.toJSON.transform = function (doc, ret, options) {
  delete ret.id;
  return ret;
};

const Exercise = mg.model("Exercise", exerciseSchema);

module.exports = Exercise;
