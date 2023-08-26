const User = require("../models/user");
const request = require("request");
const forgotPass = require("../models/forgotpass");
const crypto = require("crypto");
const verifyEmail = require("../models/verifyemail");
const { encrypt, decrypt } = require("../config/crypto");
const forgotPassMailer = require("../mailers/forgotpass_mailer");
const verifyMailer = require("../mailers/verifyemail_mailer");
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
  if (req.body.normallogin == "true") {
    if (
      req.body["g-recaptcha-response"] === undefined ||
      req.body["g-recaptcha-response"] === "" ||
      req.body["g-recaptcha-response"] === null
    ) {
      req.flash("error", "Please select captcha");
      return res.redirect("back");
    }
    const secretKey = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;
    const verificationURL =
      "https://www.google.com/recaptcha/api/siteverify?secret=" +
      secretKey +
      "&response=" +
      req.body["g-recaptcha-response"] +
      "&remoteip=" +
      req.connection.remoteAddress;
    request(verificationURL, function (error, response, body) {
      body = JSON.parse(body);
      if (body.success !== undefined && !body.success) {
        req.flash("error", "Captcha verification failed");
        return res.redirect("back");
      }
    });
  }
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
      password: encrypt(req.body.password),
      name: req.body.name,
      email: req.body.email,
      token: token,
    });

    //send mail to the user
    verifyMailer.verifyEmailMail(verifyemails.email, verifyemails.token);

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
          return res.render("verified_email", {
            title: "Email Verified",
          });
        }
      );
    } else {
      return res.redirect("back");
    }
  });
};
//Get login data
module.exports.createSession = function (req, res) {
  if (req.body.normallogin == "true") {
    if (
      req.body["g-recaptcha-response"] === undefined ||
      req.body["g-recaptcha-response"] === "" ||
      req.body["g-recaptcha-response"] === null
    ) {
      req.flash("error", "Please select captcha");
      return res.redirect("back");
    }
    const secretKey = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;
    const verificationURL =
      "https://www.google.com/recaptcha/api/siteverify?secret=" +
      secretKey +
      "&response=" +
      req.body["g-recaptcha-response"] +
      "&remoteip=" +
      req.connection.remoteAddress;
    request(verificationURL, function (error, response, body) {
      body = JSON.parse(body);
      if (body.success !== undefined && !body.success) {
        req.flash("error", "Captcha verification failed");
        return res.redirect("back");
      }
      req.flash("success", "Logged in successfully");
      return res.redirect("/");
    });
  } else {
    req.flash("success", "Logged in successfully");
    return res.redirect("/");
  }
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

      if (
        req.body.oldpassword != null &&
        decrypt(user.password) !== req.body.oldpassword
      ) {
        return res.status(500).json({
          status: "error",
          message: "Old password is incorrect",
        });
      }
      user.password = encrypt(req.body.newpassword);
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
//Forgot Password
module.exports.forgotPassword = async function (req, res) {
  return res.render("user_forgetpass", {
    title: "Forgot Password",
  });
};

module.exports.createAccessToken = async (req, res) => {
  //Creating access token and sending mail to user
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("back");
    }
    if (user) {
      //If User is found then create random token using crypto library and store it in the database
      let token = crypto.randomBytes(20).toString("hex");
      let forgotpass = await forgotPass.create({
        user: user.id,
        accessToken: token,
        isUsed: false,
      });

      forgotpass = await forgotpass.populate("user", "email name");
      //Send mail to user with token
      forgotPassMailer.newpass(forgotpass);
      req.flash("success", "Mail sent successfully");
      return res.redirect("back");
    }
  } catch (err) {
    console.log(err);
    return;
  }
};

module.exports.resetPassword = async (req, res) => {
  //Check if token is valid or not

  try {
    let forgotpass = await forgotPass.findOne({
      accessToken: req.query.accessToken,
      isUsed: false,
    });

    forgotpass = await forgotpass.populate("user", "email name");

    return res.render("../views/reset_password", {
      accessToken: req.query.accessToken,
      email: forgotpass.user.email,
    });
  } catch (err) {
    console.log(err);
    return;
  }
};
module.exports.updatePassword = async (req, res) => {
  try {
    let forgotpass = await forgotPass.findOne({
      accessToken: req.query.accessToken,
      isUsed: false,
    });

    if (!forgotpass) {
      req.flash("error", "Invalid Token");
      return res.redirect("back");
    }

    //If token is valid then update password
    const user = await User.findOne({ _id: forgotpass.user });

    if (user) {
      //Mark as used the token

      user.password = encrypt(req.body.newpassword1);
      user.save();
      forgotpass.isUsed = true;
      forgotpass.save();
      req.flash("success", "Password updated successfully");
      return res.redirect("/users/login");
    }
  } catch (err) {
    console.log(err);
    return;
  }
};
