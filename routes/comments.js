const express = require("express");
const User = require("../models/User");
const todoRouter = express.Router();
const session = require("express-session");

// Define models
const Comment = mongoose.model("Comment", commentSchema);
const Comment = require("../models/Comments");
const Todo = require("../models/Todos");

// Route to add a new comment to a todo
todoRouter.post("/todos/:todoId/comments", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.todoId);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    const { text } = req.body;
    const newComment = new Comment({ text });
    await newComment.save();

    todo.comments.push(newComment);
    await todo.save();

    res.json(newComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
