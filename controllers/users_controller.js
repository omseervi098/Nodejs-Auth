const User = require("../models/user");
const forgotPass = require("../models/forgotpass");
const crypto = require("crypto");
const verifyEmail = require("../models/verifyemail");
const verifyEmailMailer = require("../mailers/verifyemail_mailer");
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

module.exports.verifyEmail = async (req, res) => {
  try {
    if (req.body.password.length < 8) {
      req.flash("error", "Password should be atleast 6 characters long");
      return res.redirect("back");
    }
    //Check if password contains digits and characters and special characters
    if (
      !req.body.password.match(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/
      )
    ) {
      req.flash(
        "error",
        "Password should contain atleast one digit and one special character"
      );
      return res.redirect("back");
    }

    if (req.body.password != req.body.confirm_password) {
      req.flash("error", "Passwords do not match");
      return res.redirect("back");
    }
    //takeout username from mail
    let username = "";
    for (let i = 0; i < req.body.email.length; i++) {
      if (req.body.email[i] == "@") {
        break;
      }
      username += req.body.email[i];
    }

    //Check if email and username exists in the database
    let check = await User.findOne({ email: req.body.email });
    if (check) {
      req.flash("error", "Email alredy exist");
      return res.redirect("back");
    }

    //generate random token
    let token = crypto.randomBytes(20).toString("hex");

    //save token in the database
    let verifyemails = await verifyEmail.create({
      username: username,
      password: req.body.password,
      name: req.body.name,
      email: req.body.email,
      token: token,
    });

    //send mail to the user
    verifyEmailMailer.verifyEmailMail(req.body.email, token);
    console.log("Sending mail");
    req.flash("success", "Verification mail sent");
    return res.redirect("back");
  } catch (err) {
    console.log(err);
  }
};
//Get signup data
module.exports.create = async function (req, res) {
  let verifyemail = await verifyEmail.findOne({
    token: req.query.accessToken,
    isUsed: false,
  });
  if (!verifyemail) {
    req.flash("error", "Invalid Token");
    return res.redirect("back");
  }
  User.findOne({ email: verifyemail.email }, (err, user) => {
    if (err) {
      console.log("Error in finding user in signing up");
      return;
    }
    if (!user) {
      User.create(
        {
          name: verifyemail.name,
          email: verifyemail.email,
          password: verifyemail.password,
          username: verifyemail.username,
        },
        (err, user) => {
          //Mark as used the token
          verifyemail.isUsed = true;
          verifyemail.save();
          if (err) {
            console.log("Error in creating user while signing up");
            return;
          }
          req.flash("success", "Your account has been created");
          return res.redirect("/users/login");
        }
      );
    } else {
      return res.redirect("back");
    }
  });
};
//Get login data
module.exports.createSession = function (req, res) {
  //console.log(req);
  req.flash("success", "Logged in successfully");
  return res.redirect("/");
};
//Sign Out
module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out successfully");
    res.redirect("/users/login");
  });
};
module.exports.resetpage = async function (req, res) {
  return res.render("reset_pass", {
    title: "Reset Password",
  });
};
module.exports.updatepass = async function (req, res) {
  if (req.xhr) {
    try {
      let user = await User.findOne(req.user);
      if (req.body.oldpassword != user.password) {
        return res.status(500).json({
          status: "error",
          message: "Old password is incorrect",
        });
      }
      user.password = req.body.newpassword;
      user.save();
      return res.status(200).json({
        status: "success",
        message: "Password updated successfully",
      });
    } catch (err) {
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
};
