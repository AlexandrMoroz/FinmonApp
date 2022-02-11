const CompanyService = require("../services/company");
const XLMSService = require("../services/xlsx");
const { COMPANY } = require("../utils/helpers");
const CalculatorService = require("../services/calculator");

/**
 * @DESC comapny create 1. create form result. 2 create person documen with result id
 * req.body: {
 *  result: {} - form data model
 *  * }
 */
const Create = async (req, res, next) => {
  try {
    let company = await CompanyService.create(
      req.user.username,
      req.body.result
    );

    res.status(201).json({
      message: "Company was created",
      result: company,
      success: true,
    });
  } catch (err) {
    next({ message: "Unable to create company", error: err });
  }
};

/**
 * @DESC To edit company credentials
 */
const Edit = async (req, res, next) => {
  try {
    let company = await CompanyService.edit(req.user.username, req.body);

    res.status(200).json({
      message: "Company was edited",
      result: company,
      success: true,
    });
  } catch (err) {
    next({ message: "Unable to edit person", error: err });
  }
};

/**
 * @DESC To serch company
 */
const Search = async (req, res, next) => {
  try {
    let companies = await CompanyService.search(req.query.searchText);

    res.status(200).json({
      message: "Company search succcesed",
      result: companies,
      success: true,
    });
  } catch (err) {
    next({ message: "Unable to search company", error: err });
  }
};
/**
 * @DESC To get company from data by companyFromData id
 */
const FormDataById = async (req, res, next) => {
  try {
    let company = await CompanyService.getFormDataById(req.query.id);
    res.status(200).json({
      message: "Company get by id succcesed",
      result: company.result,
      success: true,
    });
  } catch (err) {
    next({ message: "Unable to Company get form by id ", error: err });
  }
};

const XLMS = async (req, res, next) => {
  try {
    let buf = await XLMSService.getDocument(COMPANY, req.query.id);
    res.status(200).json({
      message: "Company get XLSX doc by id succcesed",
      result: buf,
      success: true,
    });
  } catch (err) {
    next({
      message: "Unable to get XLSX doc by id ",
      error: JSON.stringify(err),
    });
  }
};

const RiskRate = async (req, res, next) => {
  try {
    let answers = await CalculatorService.getRisk(COMPANY, req.query.id);

    res.status(200).json({
      message: "Company get calculate risk rating ",
      result: answers,
      success: true,
    });
  } catch (err) {
    next({ message: "Unable get calculate company risk rating.", error: err });
  }
};
const Reputation = async (req, res, next) => {
  try {
    let answers = await CalculatorService.getReputation(COMPANY, req.query.id);
    res.status(200).json({
      message: "Company get calculate reputation rating ",
      result: answers,
      success: true,
    });
  } catch (err) {
    next({
      message: "Unable get calculate company reputation rating.",
      error: err,
    });
  }
};
const FinansialRisk = async (req, res, next) => {
  try {
    let answers = await CalculatorService.getFinRisk(COMPANY, req.query.id);

    res.status(200).json({
      message: "Company get calculate fin risk rating ",
      result: answers,
      success: true,
    });
  } catch (err) {
    next({
      message: "Unable get calculate company fin risk rating.",
      error: err,
    });
  }
};
module.exports = {
  FormDataById,
  Create,
  Edit,
  Search,
  XLMS,
  RiskRate,
  Reputation,
  FinansialRisk,
};
