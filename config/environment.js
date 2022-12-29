const config = require("dotenv").config();
const development = {
  name: "development",
  asset_path: "./assets",
  session_cookie_key: process.env.SESSION_COOKIE_KEY,
  db_url: process.env.MONGODB_URL,
  db: process.env.DEV_DB,
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  },
  google_clientID: process.env.GOOGLE_CLIENT_ID,
  google_clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  google_callbackURL: process.env.GOOGLE_CALLBACK_URL,
  jwt_secret: process.env.JWT_SECRET,
};
module.exports = development;
