const config = require("dotenv").config();
module.exports.home = async function (req, res) {
  return res.render("home", {
    title: "Home",
  });
};
module.exports.captcha = async function (req, res) {};
