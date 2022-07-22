const express = require("express");
const {
  getPosts,
  createPost,
  getPost,
  deletePost,
  likePost,
} = require("../controllers/posts");
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

//@route      DELETE /api/v1/posts/:id
//@desc       Deletes a post by id
//@@access    Private
router.delete("/:id", isAuth, deletePost);

//@route      PUT /api/v1/posts/:id/like
//@desc       Likes a post by id
//@@access    Private
router.put("/:id/like", isAuth, likePost);
module.exports = router;
