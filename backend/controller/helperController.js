const HelperService = require("../services/helper");
const XLSXClientFullList = require("../utils/fullClientList");
const PersonService = require("../services/person");
const CompanyService = require("../services/company");
const clientSerialize= require("../utils/clientSerializer")
/**
 * @description body contains name, data: json form
 */
const Create = async (body, res, next) => {
  try {
    const helper = await HelperService.create(body.name, body.result);

    res.status(201).json({
      message: "helper was create",
      result: { name: helper.name, result: helper.result },
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    next({ message: "Error on create helper.", error: err });
  }
};

const GetByName = async (query, res, next) => {
  try {
    let helper = await HelperService.getByName(query.name);
    res.status(200).json({
      message: "helper get by name was complited",
      result: helper,
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    next({ message: "Unable to get helper by name.", error: err });
  }
};
const GetAllClientsInXLSX = async (res, next) => {
  try {
    let fullClientList = new XLSXClientFullList();
    let persons = await PersonService.getAllFormData();
    let serializePerson = persons.map((item) => clientSerialize(item));
    let companeis = await CompanyService.getAllFormData();
    let serializeCompanies = companeis.map((item) => clientSerialize(item));
    let buf = fullClientList.createBuf([
      ...serializePerson,
      ...serializeCompanies,
    ]);
    res.status(200).json({
      message: "Get all clients in XLSX file was complited",
      result: buf,
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    next({ message: "Unable to get all clients in XLSX file.", error: err });
  }
};

module.exports = {
  Create,
  GetByName,
  GetAllClientsInXLSX,
};
