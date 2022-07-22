const express = require("express");
const { getPosts, createPost, getPost } = require("../controllers/posts");
const { isAuth } = require("../middlewares/isAuth");
const router = express.Router();

//@route      GET /api/v1/posts
//@desc       Gets all posts
//@@access    Private
router.get("/", isAuth, getPosts);

//@route      GET /api/v1/posts/:id
//@desc       Gets post by id
//@@access    Private
router.get("/:id", isAuth, getPost);

//@route      POST /api/v1/posts
//@desc       Create a post
//@@access    Private
router.post("/", isAuth, createPost);

module.exports = router;
