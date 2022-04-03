const router = require("express").Router();
const Form = require("../models/form");
const { checkSchema } = require("express-validator");
const validate = require("../middlewares/validation");
const FormValidation = require("../validation/formValidation");
const { userAuth, checkRole } = require("../utils/auth");
const { Create, Edit, GetByName } = require("../controller/formController");

router.post(
  "/create",
  userAuth,
  checkRole(["admin"]),
  checkSchema(FormValidation.getCreateValidation()),
  validate,
  async (req, res, next) => {
    await Create(req.body, res, next);
  }
);

router.put(
  "/edit",
  userAuth,
  checkRole(["admin"]),
  checkSchema(FormValidation.getEditValidation()),
  validate,
  async (req, res, next) => {
    await Edit(req.body, res, next);
  }
);

router.get(
  "/",
  userAuth,
  checkRole(["user", "admin"]),
  checkSchema(FormValidation.getFormByIdValidation()),
  validate,
  async (req, res, next) => {
    await GetByName(req.query, res, next);
  }
);

module.exports = router;
