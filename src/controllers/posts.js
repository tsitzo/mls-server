const express = require("express");
const mongoose = require("mongoose");

const User = mongoose.model("User");
const Post = mongoose.model("Post");

exports.getPosts = async (req, res) => {
  try {
    const allPosts = await Post.find({
      approved: true,
      pending: false,
    })

      .populate("user", "username image")
      .sort({ createdAt: -1 });

    res.status(200).send(allPosts);
  } catch (error) {
    return res.status(500).send({ error: "Server Error" });
  }
};

exports.getPost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: "ID not valid" });
  }

  try {
    const post = await Post.findById(id).populate("user", "username");

    if (!post) {
      return res.status(404).send({ error: "Post not found" });
    }

    if (post.pending) {
      return res.status(400).send({ error: "Post is pending approval" });
    }

    res.send(post);
  } catch (error) {
    return res.status(500).send({ error: "Server Error" });
  }
};

exports.createPost = async (req, res) => {
  const { id } = req.user;
  const { text, title } = req.body;

  if (!title || !title.trim().length) {
    return res.status(400).send({ error: "Title is required" });
  }

  if (!text || !text.trim().length) {
    return res.status(400).send({ error: "Text is required" });
  }

  try {
    const newPost = new Post({
      user: id,
      text: text.trim(),
      title: title.trim(),
    });

    const post = await newPost.save();

    res.send(post);
  } catch (error) {
    return res.status(500).send({ error: "Server Error" });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: "ID not valid" });
  }

  const post = await Post.findById(id);

  if (!post) {
    return res.status(404).send({ error: "Post not found" });
  }

  if (post.pending) {
    return res.status(400).send({ error: "Post is pending approval" });
  }

  if (post.user.toString() !== userId) {
    return res.status(401).send({ error: "User unauthorized" });
  }

  try {
    await User.updateMany(
      {},
      { $pull: { likes: id, posts: id } },
      { new: true }
    );

    await post.remove();
    res.status(200).send({ msg: "Post Deleted Successfully" });
  } catch (error) {
    return res.status(500).send({ error: "Server Error" });
  }
};

exports.likePost = async (req, res) => {
  const { id } = req.params;

  const { id: userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: "ID not valid" });
  }

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).send({ error: "Post not found" });
    }

    if (post.pending) {
      return res.status(400).send({ error: "Post is pending approval" });
    }

    if (post.likes.some((likesID) => likesID.toString() === userId)) {
      return res.status(400).send({ error: "Post already liked" });
    }

    post.likes.unshift(userId);

    await User.findByIdAndUpdate(
      userId,
      { $push: { likes: id } },
      { new: true }
    );

    await post.save();

    res.status(200).send(post.likes);
  } catch (error) {
    return res.status(500).send({ error: "Server Error" });
  }
};

exports.unlikePost = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: "ID not valid" });
  }

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).send({ error: "Post not found" });
    }

    if (post.pending) {
      return res.status(400).send({ error: "Post is pending approval" });
    }

    if (!post.likes.some((likesID) => likesID.toString() === userId)) {
      return res.status(400).send({ error: "Post not liked yet" });
    }

    post.likes = post.likes.filter((likesID) => likesID.toString() !== userId);

    await User.findByIdAndUpdate(
      userId,
      { $pull: { likes: id } },
      { new: true }
    );

    await post.save();

    res.send(post.likes);
  } catch (error) {
    return res.status(500).send({ error: "Server Error" });
  }
};

exports.agreePost = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: "ID not valid" });
  }

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).send({ error: "Post not found" });
    }

    if (post.pending) {
      return res.status(400).send({ error: "Post is pending approval" });
    }

    if (post.agrees.some((agreeId) => agreeId.toString() === userId)) {
      return res.status(400).send({ error: "Post Already agreed" });
    } else {
      post.agrees.unshift(userId);
    }

    await post.save();

    res.send(post.agrees);
  } catch (error) {
    return res.status(500).send({ error: "Server Error" });
  }
};

exports.deservePost = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: "ID not valid" });
  }

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).send({ error: "Post not found" });
    }

    if (post.pending) {
      return res.status(400).send({ error: "Post is pending approval" });
    }

    if (post.deserves.some((deserveId) => deserveId.toString() === userId)) {
      return res.status(400).send({ error: "Post Already deserved" });
    } else {
      post.deserves.unshift(userId);
    }

    await post.save();

    res.send(post.deserves);
  } catch (error) {
    return res.status(500).send({ error: "Server Error" });
  }
};

exports.commentPost = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const { text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: "ID Not Valid" });
  }

  if (!text || !text.trim().length) {
    return res.status(400).send({ error: "Text is required" });
  }

  try {
    const user = await User.findById(userId);
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).send({ error: "Post not found" });
    }

    if (post.pending) {
      return res.status(400).send({ error: "Post is pending approval" });
    }

    const newComment = {
      user: userId,
      text: text,
      username: user.username,
      image: user.image.url,
    };

    post.comments.unshift(newComment);

    await post.save();

    res.send(post.comments);
  } catch (error) {
    return res.status(500).send({ error: "Server Error" });
  }
};
