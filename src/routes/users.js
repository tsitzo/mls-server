const express = require("express");
const { getUsers } = require("../controllers/users");

const { isAuth } = require("../middlewares/isAuth");

const router = express.Router();

//@route      GET /api/v1/users
//@desc       Get all users
//@@access    Private
router.get("/", isAuth, getUsers);

module.exports = router;
