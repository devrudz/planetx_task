const { default: mongoose, Schema } = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(
      "mongodb+srv://devrud95:MuSI176GsVKEVJ6G@clusterrud.53wjjtb.mongodb.net/planetx"
    );
    console.log("Connected Database!");
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectDB;
// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("User", userSchema);
