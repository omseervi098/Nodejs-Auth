const mongoose = require("mongoose");
const env = require("./environment");
mongoose.set("strictQuery", false);
mongoose.connect(env.db_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to MongoDB"));
module.exports = db;
