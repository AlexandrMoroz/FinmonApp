const HistoryService = require("../services/history");

const PersonFormCollectionName = "PersonFormData";
const CompanyFormCollectionName = "CompanyFormData";

const PersonHistoryGetById = async (body, res, next) => {
  return getHistory(body, PersonFormCollectionName, res, next);
};
const PersonXMLSHistoryGetById = async (body, res, next) => {
  return getHistoryXmls(body, PersonFormCollectionName, res, next);
};
const CompanyHistoryGetById = async (body, res, next) => {
  return getHistory(body, CompanyFormCollectionName, res, next);
};
const CompanyXMLSHistoryGetById = async (body, res, next) => {
  return getHistoryXmls(body, CompanyFormCollectionName, res, next);
};
/**
 * @DESC get history on json format
 */
const getHistory = async (body, collectionName, res, next) => {
  try {
    let temp_history = await HistoryService.getJSONHistory(
      collectionName,
      body.id
    );
    res.status(200).json({
      message: "History get by name was complited",
      result: temp_history,
      success: true,
    });
  } catch (err) {
    next({ message: "History get by name finish by error.", error: err });
  }
};

/**
 * @DESC get history to excel file
 */
const getHistoryXmls = async (body, collectionName, res, next) => {
  try {
    let buf = await HistoryService.getXlSXHistory(collectionName, body.id);
    res.status(200).json({
      message: "History File was created success",
      result: buf,
      success: true,
    });
  } catch (err) {
    next({ message: "History file get  by name finish by error.", error: err });
  }
};

module.exports = {
  PersonHistoryGetById,
  PersonXMLSHistoryGetById,
  CompanyHistoryGetById,
  CompanyXMLSHistoryGetById,
};
