const router = require("express").Router();
const externalBaseValidator = require("../validation/externalbaseValidator");
const validate = require("../middlewares/validation");
const { checkSchema } = require("express-validator");
const { userAuth, checkRole } = require("../utils/Auth");
const {
  CompanySearch,
  PersonSearch,
} = require("../controller/externalBaseController");

/**
 * @DECS search form company
 */
router.get(
  "/search",
  userAuth,
  checkRole(["user", "admin"]),
  checkSchema(externalBaseValidator.getSearchValidation()),
  validate,
  async (req, res, next) => {
    if (req.query.type == "company") {
      await CompanySearch(req.query, res, next);
    } else if (req.query.type == "person") {
      await PersonSearch(req.query, res, next);
    }
  }
);

module.exports = router;
