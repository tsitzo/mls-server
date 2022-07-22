const express = require("express");
const { getPosts, createPost } = require("../controllers/posts");
const { isAuth } = require("../middlewares/isAuth");
const router = express.Router();

//@route      GET /api/v1/posts
//@desc       Gets all posts
//@@access    Private
router.get("/", isAuth, getPosts);

//@route      POST /api/v1/posts
//@desc       Create a post
//@@access    Private
router.post("/", isAuth, createPost);

module.exports = router;
