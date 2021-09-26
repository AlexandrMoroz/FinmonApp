const router = require("express").Router();
const PersonValidator = require("../validation/personValidation");
const validate = require("../middlewares/validation");
const { checkSchema } = require("express-validator");
const Person = require("../models/person");
const { userAuth, checkRole } = require("../utils/Auth");
const {
  FormDataById,
  Create,
  Edit,
  Search,
  XLMS,
  FinRate
} = require("../controller/personsController");
router.post(
  "/create",
  userAuth,
  checkRole(["user", "admin"]),
  checkSchema(PersonValidator.getCreateValidation()),
  validate,
  async (req, res, next) => {
    await Create(req, res, next);
  }
);

router.put(
  "/edit",
  userAuth,
  checkRole(["user", "admin"]),
  checkSchema(PersonValidator.getEditValidation()),
  validate,
  async (req, res, next) => {
    await Edit(req, res, next);
  }
);

/**
 * @DECS get person form object by id of object
 */
router.get(
  "/form-data",
  userAuth,
  checkRole(["user", "admin"]),
  checkSchema(PersonValidator.getFormDataValidation()),
  validate,
  async (req, res, next) => {
    await FormDataById(req, res, next);
  }
);
/**
 * @DECS search form person
 */
router.get(
  "/search",
  userAuth,
  checkRole(["user", "admin"]),
  checkSchema(PersonValidator.getSearchValidation()),
  validate,
  async (req, res, next) => {
    await Search(req, res, next);
  }
);

/**
 * @DECS get person XLSX buffer
 */
router.get(
  "/file",
  userAuth,
  checkRole(["user", "admin"]),
  checkSchema(PersonValidator.getFileValidation()),
  validate,
  async (req, res, next) => {
    await XLMS(req, res, next);
  }
);
router.get(
  "/finrate",
  userAuth,
  checkRole(["user", "admin"]),
  checkSchema(PersonValidator.getFinRateValidation()),
  validate,
  async (req, res, next) => {
    await FinRate(req, res, next);
    next()
  }
);
module.exports = router;
