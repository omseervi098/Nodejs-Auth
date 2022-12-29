module.exports.login = function (req, res) {
  return res.render("user_login", {
    title: "Login",
  });
};
module.exports.signup = function (req, res) {
  return res.render("user_signup", {
    title: "Sign Up",
  });
};
