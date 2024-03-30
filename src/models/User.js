const mg = require("mongoose");

const userSchema = new mg.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
});

const User = mg.model("User", userSchema);

module.exports = User;
