exports.dashboard = (req, res) => {
  res.render("dashboard", {
    admin: req.session.admin,
  });
};
