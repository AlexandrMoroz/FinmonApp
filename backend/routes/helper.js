const router = require("express").Router();
const HelperValidator = require("../validation/helperValidation");
const validate = require("../middlewares/validation");
const {checkSchema} = require("express-validator");
const { userAuth, checkRole } = require("../utils/Auth");
const {
  Create,
  GetByName,
} = require("../controller/helperController");

router.post(
  "/create",
  userAuth,
  checkRole(["admin"]),
  checkSchema(HelperValidator.getCreateValidation()),
  validate,
  async (req, res, next) => {
    return await Create(req.body, res, next);
  }
);

router.get(
  "/",
  userAuth,
  checkRole(["user", "admin"]),
  checkSchema(HelperValidator.getByNameValidation()),
  validate,
  async (req, res, next) => {
    return await GetByName(req.query, res, next);
  }
);

module.exports = router;
