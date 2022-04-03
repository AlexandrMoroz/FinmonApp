const router = require("express").Router();
const HelperValidator = require("../validation/helperValidation");
const validate = require("../middlewares/validation");
const {checkSchema} = require("express-validator");
const { userAuth, checkRole } = require("../utils/auth");
const {
  Create,
  GetByName,
  GetAllClientsInXLSX
} = require("../controller/helperController");

router.post(
  "/create",
  userAuth,
  checkRole(["admin"]),
  checkSchema(HelperValidator.getCreateValidation()),
  validate,
  async (req, res, next) => {
    await Create(req.body, res, next);
  }
);

router.get(
  "/",
  userAuth,
  checkRole(["user", "admin"]),
  checkSchema(HelperValidator.getByNameValidation()),
  validate,
  async (req, res, next) => {
    await GetByName(req.query, res, next);
  }
);
router.get(
  "/allclients",
  userAuth,
  checkRole(["admin"]),
  async (req, res, next) => {
    await GetAllClientsInXLSX(res, next);
  }
);

module.exports = router;
