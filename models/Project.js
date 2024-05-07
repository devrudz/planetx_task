const { default: mongoose } = require("mongoose");

const projectSchema = mongoose.Schema({
  title: { type: String, require: true },
  status: { type: Number, require: true },
  createdBy: { type: String, require: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
