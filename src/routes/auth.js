const express = require("express");
const { register, login } = require("../controllers/auth");

const router = express.Router();

router.get("/", (req, res) => {
  return res.send("Auth Routes");
});
//@route      POST /api/v1/auth/register
//@desc       Register a user
//@@access    Private
router.post("/register", register);

//@route      POST /api/v1/auth/login
//@desc       Login a user
//@@access    Private
router.post("/login", login);

module.exports = router;
