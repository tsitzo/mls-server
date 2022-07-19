const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username) {
    return res.status(400).send({ error: "Username is required." });
  }

  if (!email) {
    return res.status(400).send({ error: "Email is required." });
  }

  if (!password || password.length < 6) {
    return res
      .status(400)
      .send({ error: "Password should be atleast 6 characters long." });
  }

  let user = await User.findOne({ email });

  if (user) {
    return res.status(400).send({ error: "Email already in use." });
  }

  try {
    const user = new User({ username, email, password });

    await user.save();

    const token = jwt.sign({ userId: user._id }, "JWTSUPERSECRET");

    res.send({ token });
  } catch (error) {
    return res.status(422).send({ error: "Server Error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).send({ error: "Email is required." });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(422).send({ error: "Email does not exist." });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, "JWTSUPERSECRET");

    res.send({ token });
  } catch (error) {
    return res.status(422).send({ error: "Server Error" });
  }
};
