const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
const connectDB = require("./connection");
const authenticateToken = require("./authMiddleware");
const router = require("./routes/Routes");
const authRouter = require("./routes/authRouter");
const projectRouter = require("./routes/projectRouter");
const todosRouter = require("./routes/todos");

const app = express();
app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(bodyParser.json());
app.use(session({ secret: "secret", resave: true, saveUninitialized: true }));
connectDB();

app.set("view engine", "ejs");
app.use("*/css", express.static("public/css"));
app.use("*/stylesheets", express.static("public/stylesheets"));
app.use("*/assets", express.static("public/assets"));
app.use("*/img", express.static("public/img"));
app.use("*/uploads", express.static("uploads"));

app.use("/user", authenticateToken, router);
app.use("/project", authenticateToken, projectRouter);
app.use("/todo", authenticateToken, todosRouter);
app.use("/", authRouter);

app.listen("3000", () => {
  console.log("Server started!");
});
