const router = require("express").Router();
const CompanyValidator = require("../validation/companyValidation");
const validate = require("../middlewares/validation");
const { checkSchema } = require("express-validator");
const { userAuth, checkRole } = require("../utils/Auth");
const {
  FormDataById,
  Create,
  Edit,
  Search,
  XLMS,
  FinRate
} = require("../controller/companyController");

router.post(
  "/create",
  userAuth,
  checkRole(["user", "admin"]),
  checkSchema(CompanyValidator.getCreateValidation()),
  validate,
  async (req, res, next) => {
    return await Create(req, res, next);
  }
);

router.put(
  "/edit",
  userAuth,
  checkRole(["user", "admin"]),
  checkSchema(CompanyValidator.getEditValidation()),
  validate,
  async (req, res, next) => {
    return await Edit(req, res, next);
  }
);

/**
 * @DECS get company form object by id of object
 */
router.get(
  "/form-data",
  userAuth,
  checkRole(["user", "admin"]),
  checkSchema(CompanyValidator.getFormDataValidation()),
  validate,
  async (req, res, next) => {
    return await FormDataById(req, res, next);
  }
);
/**
 * @DECS search form company
 */
router.get(
  "/search",
  userAuth,
  checkRole(["user", "admin"]),
  checkSchema(CompanyValidator.getSearchValidation()),
  validate,
  async (req, res, next) => {
    return await Search(req, res, next);
  }
);

/**
 * @DECS get company XLSX buffer
 */
router.get(
  "/file",
  userAuth,
  checkRole(["admin"]),
  checkSchema(CompanyValidator.getFileValidation()),
  validate,
  async (req, res, next) => {
    return await XLMS(req, res, next);
  }
);
router.get(
  "/finrate",
  userAuth,
  checkRole(["user", "admin"]),
  checkSchema(CompanyValidator.getFinRateValidation()),
  validate,
  async (req, res, next) => {
    
    await FinRate(req, res, next);
  }
);
module.exports = router;
