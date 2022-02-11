const PersonService = require("../services/person");
const XLMSService = require("../services/xlsx");
const { PERSON } = require("../utils/helpers");
const CalculatorService = require("../services/calculator");

/**
 *
 * @DESC person create 1. create form result. 2 create person documen with result id
 * req.body: {
 *  result: {} - form data model
 *  user: ""
 * }
 */
const Create = async (req, res, next) => {
  try {
    let person = await PersonService.create(req.user.username, req.body.result);
    res.status(201).json({
      message: "Person was create",
      result: person,
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    next({ message: "Unable to create person.", error: err });
  }
};

/**
 * @DESC To edit the person
 */
const Edit = async (req, res, next) => {
  try {
    let person = await PersonService.edit(req.user.username, req.body);

    res.status(200).json({
      message: "Person was edited",
      result: person,
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    next({ message: "Unable to edit person.", error: err });
  }
};

/**
 * @DESC
 */
const Search = async (req, res, next) => {
  try {
    let persons = await PersonService.search(req.query.searchText);

    res.status(200).json({
      message: "Persons get all succcesed",
      result: persons,
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    next({ message: "Unable to search person.", error: err });
  }
};
/**
 * @DESC To get person from data by personFromData id
 */
const FormDataById = async (req, res, next) => {
  try {
    let person = await PersonService.getFormDataById(req.query.id);
    res.status(200).json({
      message: "Person get by id succcesed",
      result: person.result,
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    next({ message: "Unable to get person by id.", error: err });
  }
};

/**
 * @DESC To get person from data.
 * req.body: {
 *  id:123123123
 * }
 * id of person collection
 */
const XLMS = async (req, res, next) => {
  try {
    let buf = await XLMSService.getDocument(PERSON, req.query.id);
   
    res.status(200).json({
      message: "Person get XLSX doc by id succcesed",
      result: buf,
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    next({ message: "Unable get file from person.", error: err });
  }
};

const RiskRate = async (req, res, next) => {
  try {
    let answers = await CalculatorService.getRisk(PERSON, req.query.id);

    res.status(200).json({
      message: "Person get calculate person fin rating ",
      result: answers,
      success: true,
    });
  } catch (err) {
    next({
      message: "Unable get calculate person fin rating.",
      error: err.stack,
    });
  }
};
const Reputation = async (req, res, next) => {
  try {
    let answers = await CalculatorService.getReputation(PERSON, req.query.id);

    res.status(200).json({
      message: "Person get calculate person fin rating ",
      result: answers,
      success: true,
    });
  } catch (err) {
    next({
      message: "Unable get calculate person fin rating.",
      error: err,
    });
  }
};
const FinansialRisk = async (req, res, next) => {
  try {
    let answers = await CalculatorService.getFinRisk(PERSON, req.query.id);

    res.status(200).json({
      message: "Person get calculate person fin risk rating ",
      result: answers,
      success: true,
    });
  } catch (err) {
    next({
      message: "Unable get calculate person fin risk rating.",
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
