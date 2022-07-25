const express = require("express");
const {
  getPendingPosts,
  approvePost,
  rejectPost,
} = require("../controllers/admin");
const { isAdmin } = require("../middlewares/isAdmin");
const { isAuth } = require("../middlewares/isAuth");

const router = express.Router();

//@route      GET /api/v1/admin/posts
//@desc       Get all unmoderated posts
//@@access    Private
router.get("/posts", [isAuth, isAdmin], getPendingPosts);

//@route      PUT /api/v1/admin/posts/:id/approve
//@desc       Approves a post
//@@access    Private
router.put("/posts/:id/approve", [isAuth, isAdmin], approvePost);

//@route      PUT /api/v1/admin/posts/:id/reject
//@desc       Approves a post
//@@access    Private
router.put("/posts/:id/reject", [isAuth, isAdmin], rejectPost);

module.exports = router;
