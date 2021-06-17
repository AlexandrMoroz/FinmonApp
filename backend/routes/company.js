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
} = require("../controller/companyController");

router.post(
  "/create",
  userAuth,
  checkRole(["user", "admin"]),
  checkSchema(CompanyValidator.getCreateValidation()),
  validate,
  async (req, res) => {
    await Create(req, res);
  }
);

router.put(
  "/edit",
  userAuth,
  checkRole(["user", "admin"]),
  checkSchema(CompanyValidator.getEditValidation()),
  validate,
  async (req, res) => {
    //
    await Edit(req, res);
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
  async (req, res) => {
    //
    return FormDataById(req, res);
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
  async (req, res) => {
    //
    return Search(req, res);
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
  async (req, res) => {
    //
    return XLMS(req, res);
  }
);
module.exports = router;
