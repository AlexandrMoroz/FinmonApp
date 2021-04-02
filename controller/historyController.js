const diffHistory = require("mongoose-diff-history/diffHistory");
const PersonResult = require("../models/PersonFormData");
const { Formater } = require("../utils/formater");
const XLSXHistory = require("../utils/history");
const Helper = require("../models/helper");

const PersonFormCollection = "PersonFormData";

const PersonHistoryGetById = async (body, res) => {
  return getHistory(body, PersonResult, PersonFormCollection, res);
};
const PersonXMLSHistoryGetById = async (body, res) => {
  return getHistoryXmls(body, PersonResult, PersonFormCollection, res);
};

/**
 * @DESC get history on json format
 */
const getHistory = async (body, collection, collectionName, res) => {
  try {
    let Result = await collection.findById(body.id);
    console.error(body);
    if (!Result) {
      return res.status(400).json({
        message: `Wrong Id.`,
        success: false,
      });
    }

    let history = await diffHistory.getDiffs(collectionName, body.id);

    let translate_arr = await Helper.findOne({ name: "translate" });
    let formater = new Formater(translate_arr.data);

    let temp_history = history.map((item) => {
      return {
        diff: formater.format(item.diff),
        user: item.user,
        createdAt: item.createdAt,
      };
    });
    return res.status(201).json({
      message: "History get by name was complited",
      result: temp_history,
      success: true,
    });
  } catch (err) {
    console.log("History get by name finish by error");
    console.log(err);
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
    let Result = await collection.exists({ _id: body.id });
    if (!Result) {
      return res.status(400).json({
        message: `Wrong Id.`,
        success: false,
      });
    }
    let history = await diffHistory.getDiffs(collectionName, body.id);
    let translate_arr = await Helper.findOne({ name: "translate" });

    let xmls = new XLSXHistory(translate_arr.data);
    let buf = xmls.createHistoryBuf(history);

    return res.status(201).json({
      message: "History File was created success",
      result: buf,
      success: true
    });
  } catch (err) {
    console.log("History get by name finish by error");
    console.log(err);

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
};
