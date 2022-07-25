exports.isAdmin = (req, res, next) => {
  if (!req.user.admin) {
    return res.status(404).send({ error: "You must be an admin" });
  } else {
    next();
  }
};
