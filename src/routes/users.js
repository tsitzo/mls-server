const express = require("express");
const {
  getUsers,
  getUser,
  followUser,
  unfollowUser,
  getUserFollowing,
} = require("../controllers/users");

const { isAuth } = require("../middlewares/isAuth");

const router = express.Router();

//@route      GET /api/v1/users
//@desc       Get all users
//@@access    Private
router.get("/", isAuth, getUsers);

//@route      GET /api/v1/users/:id
//@desc       Get a user
//@@access    Private
router.get("/:id", isAuth, getUser);

//@route      PUT /api/v1/users/:id/follow
//@desc       Follow a user
//@@access    Private
router.put("/:id/follow", isAuth, followUser);

//@route      PUT /api/v1/users/:id/unfollow
//@desc       Unfollow a user
//@@access    Private
router.put("/:id/unfollow", isAuth, unfollowUser);

//@route      GET api/v1/users/:id/following
//@desc       Get all user following
//@@access    Private
router.get("/:id/following", isAuth, getUserFollowing);

module.exports = router;
