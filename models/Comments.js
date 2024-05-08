const { default: mongoose } = require("mongoose");

// Define Comment schema
const commentSchema = new mongoose.Schema({
  text: String,
  file: String,
  nestedComments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
