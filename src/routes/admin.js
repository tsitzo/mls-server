const express = require("express");
const { getPendingPosts } = require("../controllers/admin");
const { isAdmin } = require("../middlewares/isAdmin");
const { isAuth } = require("../middlewares/isAuth");

const router = express.Router();

//@route      GET /api/v1/admin/posts
//@desc       Get all unmoderated posts
//@@access    Private
router.get("/posts", [isAuth, isAdmin], getPendingPosts);

module.exports = router;
