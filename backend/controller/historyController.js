const diffHistory = require("mongoose-diff-history/diffHistory");
const PersonFormDataCollection = require("../models/personFormData");
const CompanyFormDataCollection = require("../models/companyFormData");
const { Formater } = require("../utils/formater");
const XLSXHistory = require("../utils/history");
const Helper = require("../models/helper");

const PersonFormCollectionName = "PersonFormData";
const CompanyFormCollectionName = "CompanyFormData";

const PersonHistoryGetById = async (body, res) => {
  return getHistory(
    body,
    PersonFormDataCollection,
    PersonFormCollectionName,
    res
  );
};
const PersonXMLSHistoryGetById = async (body, res) => {
  return getHistoryXmls(
    body,
    PersonFormDataCollection,
    PersonFormCollectionName,
    res
  );
};
const CompanyHistoryGetById = async (body, res) => {
  return getHistory(
    body,
    CompanyFormDataCollection,
    CompanyFormCollectionName,
    res
  );
};
const CompanyXMLSHistoryGetById = async (body, res) => {
  return getHistoryXmls(
    body,
    CompanyFormDataCollection,
    CompanyFormCollectionName,
    res
  );
};
/**
 * @DESC get history on json format
 */
const getHistory = async (body, collection, collectionName, res) => {
  try {

    let history = await diffHistory.getDiffs(collectionName, body.id);

    let translate_arr = await Helper.findOne({ name: "translate" });
    let formater = new Formater(translate_arr.content);

    let temp_history = history.map((item) => {
      return {
        diff: formater.format(item.diff),
        user: item.user,
        createdAt: item.createdAt,
      };
    });
    return res.status(200).json({
      message: "History get by name was complited",
      result: temp_history,
      success: true,
    });
  } catch (err) {
    
    
    return res.status(500).json({
      message: "History get by name finish by error.",
      success: false,
      error: err,
    });
  }
};

/**
 * @DESC get history to excel file
 */
const getHistoryXmls = async (body, collection, collectionName, res) => {
  try {

    let history = await diffHistory.getDiffs(collectionName, body.id);
    let translate_arr = await Helper.findOne({ name: "translate" });

    let xmls = new XLSXHistory(translate_arr.content);
    let buf = xmls.createHistoryBuf(history);

    return res.status(200).json({
      message: "History File was created success",
      result: buf,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "History get by name finish by error.",
      success: false,
      error: err,
    });
  }
};

module.exports = {
  PersonHistoryGetById,
  PersonXMLSHistoryGetById,
  CompanyHistoryGetById,
  CompanyXMLSHistoryGetById,
};
