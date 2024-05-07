const express = require("express");
const Todos = require("../models/Todos");
const Project = require("../models/Project");
const todosRouter = express.Router();
const session = require("express-session");

const generateRandomNumber = () => {
  return Math.floor(Math.random() * 100);
};

// List Project
todosRouter.get("/", async (req, res) => {
  // Define the query conditions
  try {
    const userID = req.session.user._id;
    const todos = await Todos.find({ createdBy: userID }).sort({
      priority: "asc",
    });
    // res.send(ProjectData);
    // res.send(req.session);
    res.render("todo/todos", {
      todos: [],
      generateRandomNumber: generateRandomNumber,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Create out Project
todosRouter.post("/", async (req, res) => {
  try {
    const { task, description, priority, deadline, project_id } = req.body;
    const todos = new Todos({
      task,
      description,
      priority,
      status: "to-do",
      projectId: project_id,
      deadline: deadline,
      asignedTo: req.session.user._id,
      createdBy: req.session.user._id,
    });
    const todosList = await todos.save();
    // res.render("todos/todo", { todosList: todosList });
    res.redirect("/project/" + project_id);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Get Project by ID
todosRouter.get("/:id", async (req, res) => {
  console.log(req);
  let slug = req.params.id;
  try {
    const editTodo = await Todos.findById({ _id: slug });
    const projectData = await Project.findById({ _id: editTodo.projectId });
    res.render("todos/todo", {
      editTodo: editTodo,
      projectData: projectData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Update Project
todosRouter.post("/:id", async (req, res) => {
  try {
    const { task, description, priority, status, deadline, project_id } =
      req.body;
    const updateTodos = await Todos.findByIdAndUpdate(
      req.params.id,
      {
        task,
        description,
        priority,
        status,
        deadline,
        updatedAt: Date.now(),
      },
      { new: true }
    );
    res.redirect("/project/" + project_id);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// // Delete Project
todosRouter.post("/:id/delete", async (req, res) => {
  let slug = req.params.id;
  try {
    await Todos.deleteOne({ _id: slug });
    res.redirect("/project/" + req.body.project_id);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});
module.exports = todosRouter;
