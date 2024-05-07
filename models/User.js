const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  status: { type: Number, require: true },
  createdAt: { type: Date, default: Date.now() },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
