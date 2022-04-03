const router = require("express").Router();
const User = require("../models/user");
const UserValidator = require("../validation/userValidation");
const validate = require("../middlewares/validation");
// Bring in the User Registration function
const { userAuth, checkRole } = require("../utils/auth");
const { checkSchema } = require("express-validator");
const { Create, Edit, Login, All } = require("../controller/userController");

// Users Registeration Route
router.post(
  "/create",
  userAuth,
  checkRole(["admin"]),
  checkSchema(UserValidator.getCreateValidation()),
  validate,
  async (req, res, next) => {
    await Create(req.body, res, next);
  }
);
// Users Registeration Route
router.put(
  "/edit",
  userAuth,
  checkRole(["admin"]),
  checkSchema(UserValidator.getEditValidation()),
  validate,
  async (req, res, next) => {
    await Edit(req.body, res, next);
  }
);

// Users Login Route
router.post(
  "/login",
  checkSchema(UserValidator.getLoginValidation()),
  validate,
  async (req, res, next) => {
    await Login(req.body, res, next);
  }
);

// Get all users
router.get("/all", userAuth, checkRole(["admin"]), async (req, res, next) => {
  await All(res, next);
});

module.exports = router;
