const express = require("express");
const mongoose = require("mongoose");

const User = mongoose.model("User");
const Post = mongoose.model("Post");

exports.getPosts = async (req, res) => {
  const perPage = 2;
  const page = req.params.page ? req.params.page : 1;

  try {
    const allPosts = await Post.find({
      approved: true,
      pending: false,
    })
      .skip((page - 1) * perPage)
      .populate("user", "username image")
      .sort({ createdAt: -1 })
      .limit(perPage);

    res.status(200).send(allPosts);
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
