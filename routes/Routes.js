const express = require("express");
const User = require("../models/User");
const Project = require("../models/Project");
const router = express.Router();
const session = require("express-session");

router.get("/", async (req, res) => {
  try {
    const userData = await User.find();
    console.log(userData);
    res.send(userData);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.get("/profile", async (req, res) => {
  // Access session data
  const user = req.session.user;
  const userID = req.session.user._id;
  const ProjectData = await Project.find({ createdBy: userID }).sort({
    title: "asc",
  });
  if (user) {
    res.render("User/profile", { user, ProjectList: ProjectData });
  } else {
    res.redirect("/login");
  }
});

// Protected route
router.get("/protected", (req, res) => {
  res.send("Welcome to the protected route!");
});

router.get("/session", (req, res) => {
  const token = req.session.token;
  console.log(token);
  if (token) {
    res.send(`Token:  ${token}`);
  } else {
    res.send("error");
  }
});

// Create user
router.post("/", async (req, res) => {
  // res.send(req.body);
  const { name, email, password, status } = req.body;
  try {
    const user = new User({ name, email, password, status });
    await user.save();
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.post("/:id", async (req, res) => {
  console.log(req);
  let slug = req.params.id;
  try {
    const userData = await User.findById({ _id: slug });
    console.log(userData);
    res.send(userData);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.delete("/:id", async (req, res) => {
  let slug = req.params.id;
  try {
    const userData = await User.deleteOne({ _id: slug });
    console.log(userData);
    res.send(userData);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.put("/:id", async (req, res) => {
  // res.send("update");
  try {
    const userUpdated = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        status: req.body.status,
      },
      { new: true }
    );
    res.send(userUpdated);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;
