const mongoose = require("mongoose");

const { Schema } = mongoose;

const postSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  agrees: [{ type: Schema.Types.ObjectId, ref: "User" }],
  deserves: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      text: { type: String, required: true },
      user: { type: Schema.Types.ObjectId, ref: "User" },
      username: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      image: { type: String },
    },
  ],
  pending: { type: Boolean, default: true },
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

mongoose.model("Post", postSchema);
