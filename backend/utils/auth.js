const passport = require("passport");

/**
 * @DESC Passport middleware
 */
const userAuth = passport.authenticate("jwt", { session: false });

/**
 * @DESC Check Role Middleware
 */
const checkRole = (roles) => (req, res, next) => {
  !roles.includes(req.user.role)
    ? res.status(403).json("Forbidden")
    : next();
};

const serializeUser = (user) => {
  return {
    id: user._id,
    block: user.block,
    username: user.username,
    role: user.role,
    email: user.email,
    name: user.name,
    family: user.family,
    surname: user.surname,
    cashboxAdress: user.cashboxAdress,
  };
};

module.exports = {
  userAuth,
  checkRole,
  serializeUser,
};
