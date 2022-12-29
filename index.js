const express = require("express");
const env = require("./config/environment");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const app = express();
require("./config/view-helpers")(app);
const port = 3000;
const db = require("./config/mongoose");
const passportGoogle = require("./config/passport-google-oauth");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const MongoStore = require("connect-mongodb-session")(session);
const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const customMware = require("./config/middleware");
const path = require("path");
app.use(
  sassMiddleware({
    src: path.join(__dirname, env.asset_path, "scss"),
    dest: path.join(__dirname, env.asset_path, "css"),
    debug: true,
    outputStyle: "extended",
    prefix: "/css",
  })
);
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(express.static(env.asset_path));
// for EJS
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(
  session({
    name: "NODE AUTH",
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new MongoStore({
      uri: env.db_url,
      collection: "db",
      autoRemove: "disabled",
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
//use express router
app.use("/", require("./routes"));

app.listen(port, (e) => {
  if (e) {
    console.log(e);
    return;
  }
  console.log("Server is running on port " + port);
});
