const router = require("express").Router();
const HistoryValidator = require("../validation/historyValidation");
const validate = require("../middlewares/validation");
const { checkSchema } = require("express-validator");
const { userAuth, checkRole } = require("../utils/Auth");
const {
  PersonHistoryGetById,
  PersonXMLSHistoryGetById,
  CompanyHistoryGetById,
  CompanyXMLSHistoryGetById,
} = require("../controller/historyController");
const PersonFormDataCollection = require("../models/personFormData");
const CompanyFormDataCollection = require("../models/companyFormData");
router.get(
  "/person-history",
  userAuth,
  checkRole(["admin"]),
  checkSchema(HistoryValidator.getHistoryValidation(PersonFormDataCollection)),
  validate,
  async (req, res, next) => {
    
    return PersonHistoryGetById(req.query, res, next);
  }
);

router.get(
  "/person-history-file",
  userAuth,
  checkRole(["admin"]),
  checkSchema(HistoryValidator.getHistoryValidation(PersonFormDataCollection)),
  validate,
  async (req, res, next) => {
    
    return PersonXMLSHistoryGetById(req.query, res, next);
  }
);

router.get(
  "/company-history",
  userAuth,
  checkRole(["admin"]),
  checkSchema(HistoryValidator.getHistoryValidation(CompanyFormDataCollection)),
  validate,
  async (req, res, next) => {
    
    return CompanyHistoryGetById(req.query, res, next);
  }
);
router.get(
  "/company-history-file",
  userAuth,
  checkRole(["admin"]),
  checkSchema(HistoryValidator.getHistoryValidation(CompanyFormDataCollection)),
  validate,
  async (req, res, next) => {
    
    return CompanyXMLSHistoryGetById(req.query, res, next);
  }
);

module.exports = router;