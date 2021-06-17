const router = require("express").Router();
const User = require("../models/user");
const UserValidator = require("../validation/userValidation");
const validate = require("../middlewares/validation");
// Bring in the User Registration function
const { userAuth, checkRole } = require("../utils/Auth");
const { checkSchema } = require("express-validator");
const { Create, Edit, Login, All } = require("../controller/userController");

// Users Registeration Route
router.post(
  "/create",
  userAuth,
  checkRole(["admin"]),
  checkSchema(UserValidator.getCreateValidation()),
  validate,
  async (req, res) => {
    await Create(req.body, res);
  }
);
// Users Registeration Route
router.put(
  "/edit",
  userAuth,
  checkRole(["admin"]),
  checkSchema(UserValidator.getEditValidation()),
  validate,
  async (req, res) => {
  
    await Edit(req.body, res);
  }
);

// Users Login Route
router.post(
  "/login",
  checkSchema(UserValidator.getLoginValidation()),
  validate,
  async (req, res) => {
    await Login(req.body, res);
  }
);

// Get all users
router.get("/all", userAuth, checkRole(["admin"]), async (req, res) => {
  return All(res);
});

module.exports = router;
