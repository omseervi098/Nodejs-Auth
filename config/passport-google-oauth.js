const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");
const env = require("./environment");
const { encrypt } = require("./crypto");
//Tell passport to use a new strategy for google login
passport.use(
  new googleStrategy(
    {
      clientID: env.google_clientID,
      clientSecret: env.google_clientSecret,
      callbackURL: env.google_callbackURL,
    },
    function (accessToken, refreshToken, profile, done) {
      // find a user
      User.findOne({ email: profile.emails[0].value }).exec(function (
        err,
        user
      ) {
        if (err) {
          console.log("error in google strategy-passport", err);
          return;
        }
        //console.log(accessToken, refreshToken);
        if (user) {
          // if found, set this user as req.user
          //console.log(profile);
          return done(null, user);
        } else {
          // if not found, create the user and set it as req.user
          let username = "";
          for (let i = 0; i < profile.emails[0].value.length; i++) {
            if (profile.emails[0].value[i] == "@") {
              break;
            }
            username += profile.emails[0].value[i];
          }
          User.create(
            {
              name: profile.displayName,
              email: profile.emails[0].value,
              password: encrypt(crypto.randomBytes(20).toString("hex")),
              username: username,
            },
            function (err, user) {
              if (err) {
                console.log(
                  "error in creating user google strategy-passport",
                  err
                );
                return;
              }
              return done(null, user);
            }
          );
        }
      });
    }
  )
);
module.exports = passport;
