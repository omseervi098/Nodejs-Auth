const express = require("express");
const router = express.Router();
const passport = require("passport");
const passportLocal = require("../config/passport-local-strategy");
const usersController = require("../controllers/users_controller");
router.get("/login", usersController.login);
router.get("/signup", usersController.signup);
module.exports = router;
