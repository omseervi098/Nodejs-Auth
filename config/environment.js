const config = require("dotenv").config();
const development = {
  name: "development",
  asset_path: "./assets",
  session_cookie_key: process.env.SESSION_COOKIE_KEY,
  db_url: process.env.MONGODB_URL,
  db: process.env.DEV_DB,
  smtp: {
    pool: true,
    host: "smtp.socioknct.tech",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
  google_clientID: process.env.GOOGLE_CLIENT_ID,
  google_clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  google_callbackURL: process.env.GOOGLE_CALLBACK_URL,
  jwt_secret: process.env.JWT_SECRET,
  crypto_alg: process.env.CRYPTO_ALGORITHM,
  crypto_key: process.env.CRYPTO_SECRET,
  captcha_secret: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
  captcha_sitekey: process.env.GOOGLE_RECAPTCHA_SITE_KEY,
};
const production = {
  name: "production",
  asset_path: process.env.ASSET_PATH,
  session_cookie_key: process.env.SESSION_COOKIE_KEY,
  db_url: process.env.MONGODB_URL,
  db: process.env.DEV_DB,
  smtp: {
    pool: true,
    host: "smtp.socioknct.tech",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
  google_clientID: process.env.GOOGLE_CLIENT_ID,
  google_clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  google_callbackURL: process.env.GOOGLE_CALLBACK_URL,
  jwt_secret: process.env.JWT_SECRET,
  crypto_alg: process.env.CRYPTO_ALGORITHM,
  crypto_key: process.env.CRYPTO_SECRET,
  captcha_secret: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
  captcha_sitekey: process.env.GOOGLE_RECAPTCHA_SITE_KEY,
};
module.exports = production;
