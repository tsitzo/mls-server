const mongoose = require("mongoose");

const User = mongoose.model("User");
const Post = mongoose.model("Post");

exports.getPendingPosts = async (req, res) => {
  try {
    const allPendingPosts = await Post.find({ approved: false, pending: true })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.send(allPendingPosts);
  } catch (error) {
    return res.status(500).send({ error: "Server Error" });
  }
};
