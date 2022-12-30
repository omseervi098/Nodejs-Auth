const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home_controller");

router.get("/", homeController.home);
router.get("/captcha", homeController.captcha);
router.use("/users", require("./users"));
module.exports = router;
