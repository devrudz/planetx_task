const express = require("express");
const session = require("express-session");
const todosRouter = express.Router();
const multer = require("multer");
const fs = require("fs");
// Define models
const Todos = require("../models/Todos");
const Project = require("../models/Project");
const Comment = require("../models/Comments");

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // File naming convention
    // cb(null, file.originalname); // File naming convention
  },
});

const upload = multer({ storage: storage });

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
todosRouter.post("/", upload.single("attachment"), async (req, res) => {
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
    if (req.file) {
      todos.file = req.file.path;
    }
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
  const user = req.session.user;
  try {
    const editTodo = await Todos.findById({ _id: slug })
      .populate({
        path: "comments",
        populate: { path: "nestedComments" },
      })
      .sort({ createdAt: 1 });
    const projectData = await Project.findById({ _id: editTodo.projectId });
    res.render("todos/todo", {
      editTodo: editTodo,
      projectData: projectData,
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// // Update Project
// todosRouter.post("/:id", upload.single("attachment"), async (req, res) => {
//   try {
//     const { task, description, priority, status, deadline, project_id } =
//       req.body;
//     const { attachment } = req.file.path;
//     const updateTodos = await Todos.findByIdAndUpdate(
//       req.params.id,
//       {
//         task,
//         file: attachment,
//         description,
//         priority,
//         status,
//         deadline,
//         updatedAt: Date.now(),
//       },
//       { new: true }
//     );

//     res.redirect("/project/" + project_id);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error);
//   }
// });

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

// // Delete Comment
todosRouter.post("/:todoId/comment/:commentId/delete", async (req, res) => {
  let slug = req.params.commentId;
  try {
    await Comment.deleteOne({ _id: slug });
    res.redirect("/todo/" + req.params.todoId);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Route to add a new comment to a todo
todosRouter.post(
  "/:todoId/comments",
  upload.single("attachment"),
  async (req, res) => {
    try {
      const todo = await Todos.findById(req.params.todoId);
      if (!todo) return res.status(404).json({ message: "Todo not found" });

      const { text } = req.body;
      const newComment = new Comment({ text });
      if (req.file) {
        newComment.file = req.file.path; // Save file path in the comment document
      }

      await newComment.save();

      todo.comments.push(newComment);
      await todo.save();
      res.redirect("/todo/" + req.params.todoId);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Route to add a new nested comment to a comment
todosRouter.post(
  "/:todoId/comment/:commentId/nestedComments",
  upload.single("attachment"),
  async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment)
        return res.status(404).json({ message: "Comment not found" });

      const { text } = req.body;
      const newComment = new Comment({ text });
      if (req.file) {
        newComment.file = req.file.path; // Save file path in the comment document
      }
      await newComment.save();

      comment.nestedComments.push(newComment);
      await comment.save();

      res.redirect("/todo/" + req.params.todoId);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Update Project
todosRouter.post("/:id", upload.single("attachment"), async (req, res) => {
  try {
    const todoId = req.params.id;
    const updateTodos = await Todos.findById(todoId);
    if (!updateTodos) {
      return res.status(404).json({ error: "Record not found" });
    }
    updateTodos.task = req.body.task || updateTodos.task;
    updateTodos.description = req.body.description || updateTodos.description;
    updateTodos.priority = req.body.priority || updateTodos.priority;
    updateTodos.status = req.body.status || updateTodos.status;
    updateTodos.deadline = req.body.deadline || updateTodos.deadline;
    updateTodos.updatedAt = Date.now();

    if (req.file) {
      // Use fs.stat() to check if the file exists
      fs.stat(updateTodos.file, (err, stats) => {
        if (err) {
          if (err.code === "ENOENT") {
            console.log("File does not exist");
          } else {
            console.error("Error occurred while checking file status:", err);
          }
        } else {
          if (stats.isFile()) {
            // Remove existing file
            if (updateTodos.file) {
              // fs.unlinkSync(path.join(__dirname, "public", updateTodos.file));
              fs.unlinkSync(updateTodos.file);
            }
          } else {
            console.log("Path is not a file");
          }
        }
      });

      updateTodos.file = req.file.path;
    }

    await updateTodos.save();
    res.redirect("/project/" + req.body.project_id);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = todosRouter;
