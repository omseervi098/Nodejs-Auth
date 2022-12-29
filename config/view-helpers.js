const fs = require("fs");
const env = require("./environment");
const path = require("path");
module.exports = (app) => {
  app.locals.assetPath = function (filePath) {
    if (env.name == "development") {
      return "/" + filePath;
    }
    return (
      "/" +
      JSON.parse(fs.readFileSync(path.join(__dirname, "../rev-manifest.json")))[
        filePath
      ]
    );
  };
};
