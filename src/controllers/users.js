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

exports.followUser = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: "ID not valid" });
  }

  if (userId === id) {
    return res.status(400).send({ error: "You cannot follow yourself" });
  }

  try {
    const userToFollow = await User.findById(id);
    const userFollowing = await User.findById(userId);

    if (!userToFollow || !userFollowing) {
      return res.status(400).send({ error: "User not found" });
    }

    if (
      userToFollow.followers.some((user) => user.toString() === userId) &&
      userFollowing.following.some(
        (user) => user.toString() === userToFollow.id
      )
    ) {
      return res.status(400).send({ error: "User already followed" });
    }

    userToFollow.followers.unshift(userId);
    userFollowing.following.unshift(userToFollow);

    await userToFollow.save();
    await userFollowing.save();

    res.status(200).send(userToFollow.followers);
  } catch (error) {
    return res.status(500).send({ error: "Server Error" });
  }
};

exports.unfollowUser = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: "ID not valid" });
  }

  if (userId === id) {
    return res.status(400).send({ error: "You cannot unfollow yourself" });
  }

  try {
    const userToFollow = await User.findById(id);
    const userFollowing = await User.findById(userId);

    if (!userToFollow || !userFollowing) {
      return res.status(400).send({ error: "User not found" });
    }

    if (
      !userToFollow.followers.some((user) => user.toString() === userId) &&
      !userFollowing.following.some(
        (user) => user.toString() === userToFollow.id
      )
    ) {
      return res.status(400).send({ error: "User need to be followed" });
    }

    userToFollow.followers = userToFollow.followers.filter(
      (user) => user.toString() !== userId
    );
    userFollowing.following = userFollowing.following.filter(
      (user) => user.toString() !== userToFollow.id
    );

    await userToFollow.save();
    await userFollowing.save();

    res.status(200).send(userToFollow.followers);
  } catch (error) {
    return res.status(500).send({ error: "Server Error" });
  }
};

exports.getUserFollowing = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: "ID not valid" });
  }

  try {
    const user = await User.findById(id).select("-password");

    const following = await User.find({ _id: { $in: user.following } }).select(
      "username image"
    );

    res.status(200).send(following);
  } catch (error) {
    return res.status(500).send({ error: "Server Error" });
  }
};

exports.getUserFollowers = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: "ID not valid" });
  }

  try {
    const user = await User.findById(id).select("-password");

    const followers = await User.find({ _id: { $in: user.followers } }).select(
      "username image"
    );

    res.status(200).send(followers);
  } catch (error) {
    return res.status(500).send({ error: "Server Error" });
  }
};
