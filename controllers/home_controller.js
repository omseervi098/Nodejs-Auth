module.exports.home = async function (req, res) {
  return res.render("home", {
    title: "Home",
  });
};
