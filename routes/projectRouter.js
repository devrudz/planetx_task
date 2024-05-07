const express = require("express");
const Project = require("../models/Project");
const Todos = require("../models/Todos");
const projectRouter = express.Router();
const session = require("express-session");

// List Project
projectRouter.get("/", async (req, res) => {
  // Define the query conditions
  let slug = req.params.id;
  try {
    const user = req.session.user;
    const userID = req.session.user._id;
    const ProjectData = await Project.find({
      createdBy: userID,
      user: user,
    }).sort({
      title: "asc",
    });
    const todosList = await Todos.find({ projectId: slug });
    const To_dos = await Todos.find({
      projectId: slug,
      status: "to-do",
    }).countDocuments();
    const closedTodos = await Todos.find({
      projectId: slug,
      status: "done",
    }).countDocuments();
    const openTodos = await Todos.find({
      projectId: slug,
      status: "in-progress",
    }).countDocuments();

    res.render("Projects/project", {
      projectData: ProjectData,
      user: user,
      To_dos: To_dos,
      closedTodos: closedTodos,
      openTodos: openTodos,
      todosList: todosList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Create out Project
projectRouter.post("/", async (req, res) => {
  try {
    const { title, status } = req.body;
    const project = new Project({
      title,
      status,
      createdBy: req.session.user._id,
    });
    await project.save();
    res.redirect("/user/profile");
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Get Project by ID
projectRouter.get("/:id", async (req, res) => {
  const user = req.session.user;
  let slug = req.params.id;
  try {
    const projectData = await Project.findById({ _id: slug });
    const todosList = await Todos.find({ projectId: slug });
    const To_dos = await Todos.find({
      projectId: slug,
      status: "to-do",
    }).countDocuments();
    const closedTodos = await Todos.find({
      projectId: slug,
      status: "done",
    }).countDocuments();
    const openTodos = await Todos.find({
      projectId: slug,
      status: "in-progress",
    }).countDocuments();
    res.render("Projects/project", {
      projectData: projectData,
      todosList: todosList,
      To_dos: To_dos,
      closedTodos: closedTodos,
      openTodos: openTodos,
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Update Project
projectRouter.post("/:id", async (req, res) => {
  try {
    const projectUpdated = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        status: req.body.status,
        createdBy: req.session.user._id,
        updatedAt: Date.now(),
      },
      { new: true }
    );
    // res.send(projectUpdated);
    res.redirect("/user/profile");
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Delete Project
projectRouter.post("/:id/delete", async (req, res) => {
  let slug = req.params.id;
  try {
    await Project.deleteOne({ _id: slug });
    res.redirect("/user/profile");
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});
module.exports = projectRouter;
