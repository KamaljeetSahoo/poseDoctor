const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  handExtensions: [
    {
      date: String,
      count: Number,
      adherance: Number,
      totalTime: Number
    }
  ],
  squats: [
    {
      date: String,
      count: Number,
      adherance: Number,
      totalTime: Number
    }
  ]
});
const User = new mongoose.model("user", UserSchema);
User.createIndexes();
module.exports = User;
