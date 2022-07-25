const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
const nanoid = require("nanoid");

const User = mongoose.model("User");
const Post = mongoose.model("Post");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -email");
    res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({ error: "Server Error" });
  }
};

exports.getUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: "ID not valid" });
  }

  try {
    const user = await User.findById(id).select("-password");

    const posts = await Post.find({ user: id })
      .populate("user", "username image")
      .sort({ createdAt: -1 });

    res.send({ user, posts });
  } catch (error) {
    return res.status(500).send({ error: "Server Error" });
  }
};
