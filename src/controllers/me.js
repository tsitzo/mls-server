const mongoose = require("mongoose");

const User = mongoose.model("User");
const Post = mongoose.model("Post");

exports.getMe = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id).select("-password");

    res.send(user);
  } catch (error) {
    return res.status(500).send({ error: "Server Error" });
  }
};
