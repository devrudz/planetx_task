const { default: mongoose } = require("mongoose");

const todosSchema = mongoose.Schema({
  task: { type: String, require: true },
  description: { type: String, require: true },
  priority: {
    type: String,
    require: true,
    enum: ["High", "Medium", "Low"],
  },
  status: {
    type: String,
    require: true,
    enum: ["to-do", "in-progress", "pending"],
  },
  deadline: { type: Date, require: true },
  projectId: { type: String, require: true },
  asignedTo: { type: String },
  createdBy: { type: String, require: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

const Todos = mongoose.model("Todos", todosSchema);
module.exports = Todos;
