const express = require("express");
const router = express.Router();
const passport = require("passport");
const passportLocal = require("../config/passport-local-strategy");
const usersController = require("../controllers/users_controller");
router.get("/login", usersController.login);
router.get("/signup", usersController.signup);
router.post("/verify-email", usersController.verifyEmail);
router.get("/create", usersController.create);
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/login" }),
  usersController.createSession
);
router.get(
  "/resetpass",
  passportLocal.checkAuthenication,
  usersController.resetpage
);
router.post(
  "/updatepass",
  passportLocal.checkAuthenication,
  usersController.updatepass
);
router.get("/signout", usersController.destroySession);
router.get("/forgot-password", usersController.forgotPassword);
router.post(
  "/forgot-password/create-access-token",
  usersController.createAccessToken
);
router.get("/forgot-password/reset-password/", usersController.resetPassword);
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/login" }),
  usersController.createSession
);
module.exports = router;
