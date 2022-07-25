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

exports.approvePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: "ID not valid" });
  }

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).send({ error: "Post not found" });
    }

    if (!post.pending) {
      return res.status(400).send({ error: "Post not pending approval" });
    }

    await Post.findByIdAndUpdate(
      id,
      { approved: true, pending: false, createdAt: Date.now() },
      { new: true }
    );

    await User.findByIdAndUpdate(
      post.user,
      { $push: { posts: post.id } },
      { new: true }
    );

    res.send(post);
  } catch (error) {
    return res.status(500).send({ error: "Server Error" });
  }
};
