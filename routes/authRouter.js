const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();
const LocalStorage = require("node-localstorage").LocalStorage;
const localStorage = new LocalStorage("./localStorage");

authRouter.get("/css", (req, res) => {
  res.render("home");
});
authRouter.get("/signup", (req, res) => {
  if (req.session.user) {
    res.redirect("/user/profile");
  }
  res.render("signup", { user: req.session.user });
});
// Register route
authRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password, status = 1 } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, status });
    // users.push(user);
    await user.save();
    res.redirect("login");
    // res.status(201).send("User registered successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error registering user");
  }
});

authRouter.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect("/user/profile");
  }
  res.render("login", { user: req.session.user });
});
// Login route
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      toast().default("Title", "Message!").show();
      return res.status(401).send("Invalid password");
    }
    // Generate JWT token
    const token = jwt.sign({ email: user.email }, "secret", {
      expiresIn: "365d",
    });
    localStorage.setItem("jwt_token", token);
    req.session.token = token;
    req.session.user = user;
    res.redirect("/user/profile");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in");
  }
});

authRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send("Internal Server Error");
    } else {
      res.redirect("/login");
    }
  });
});

module.exports = authRouter;
