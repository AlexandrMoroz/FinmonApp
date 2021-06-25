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
} = require("../controller/personsController");
router.post(
  "/create",
  userAuth,
  checkRole(["user", "admin"]),
  checkSchema(PersonValidator.getCreateValidation()),
  validate,
  async (req, res) => {
    //
    await Create(req, res);
  }
);

router.put(
  "/edit",
  userAuth,
  checkRole(["user", "admin"]),
  checkSchema(PersonValidator.getEditValidation()),
  validate,
  async (req, res) => {
    //
    await Edit(req, res);
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
  async (req, res) => {
    return FormDataById(req, res);
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
  async (req, res) => {
    //
    return Search(req, res);
  }
);

/**
 * @DECS get person XLSX buffer
 */
router.get(
  "/file",
  userAuth,
  checkRole(["user","admin"]),
  checkSchema(PersonValidator.getFileValidation()),
  validate,
  async (req, res) => {
    return XLMS(req, res);
  }
);
module.exports = router;
