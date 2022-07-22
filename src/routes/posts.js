const express = require("express");
const { createPost } = require("../controllers/posts");
const { isAuth } = require("../middlewares/isAuth");
const router = express.Router();

//@route      POST /api/v1/posts
//@desc       Create a post
//@@access    Private
router.post("/", isAuth, createPost);

module.exports = router;
