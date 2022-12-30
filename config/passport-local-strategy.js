const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const { decrypt } = require("../config/crypto");
//Authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      //Find the user establish the session
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          req.flash("error", "Error in finding user");
          return done(err);
        }

        if (!user || decrypt(user.password) != password) {
          req.flash("error", "Invalid Username/Password");
          return done(null, false);
        }
        return done(null, user);
      });
    }
  )
);
//serialize user to decide which key is to be kept in the session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
//Deserialize user from the key in cookies
passport.deserializeUser(function (user, done) {
  User.findById(user, function (err, user) {
    if (err) {
      console.log("Error in finding user while deserializing");
      return done(err);
    }
    return done(null, user);
  });
});
//Check if user is authenicated
passport.checkAuthenication = function (req, res, next) {
  //IF user is authenticated then we can move ahead
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/users/login");
};
passport.setAuthenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    //req user contains current signed in user from session cookie and we are just sending this to locals for the views
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
