const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 64,
  },
  title: { type: String, enum: ["Mr.", "Mrs.", "Miss"] },
  city: { type: String },
  country: { type: String },
  about: {
    type: String,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  bio: { type: String },
  location: { type: String },
  image: {
    public_id: "",
    url: "",
  },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  likes: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  visitors: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

mongoose.model("User", userSchema);
