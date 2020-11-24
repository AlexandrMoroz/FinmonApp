const diffHistory = require("mongoose-diff-history/diffHistory");
const PersonResult = require("../models/PersonFormResult");
const FopResult = require("../models/FOPFormResult");
const Helper = require("../models/Helper");
const getXmls = require("../utils/xmlshistory");

const PeopleForm = "peopleFormResults";
const FopForm = "FOPFormResults";

const PersonHistoryGetById = async (Dets, res) => {
  return getHistory(Dets, PersonResult, PeopleForm, res);
};
const FopHistoryGetById = async (Dets, res) => {
  return getHistory(Dets, FopResult, FopForm, res);
};
const PersonXMLSHistoryGetById = async (Dets, res) => {
  return getHistoryXmls(Dets, PersonResult, PeopleForm, res);
};
const getHistory = async (Dets, collection, collectionName, res) => {
  try {
    let Result = await collection.findOne({ _id: Dets.id });
    if (!Result) {
      return res.status(400).json({
        message: `Wrong Id.`,
        success: false,
      });
    }

    let history = await diffHistory.getDiffs(collectionName, Dets.id);

    return res.status(201).json({
      message: "History get by name was complited",
      result: history.map((item) => {
        return {
          diff: item.diff.result,
          user: item.user,
          createdAt: item.createdAt,
        };
      }),
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

const getHistoryXmls = async (Dets, collection, collectionName, res) => {
  try {
    let Result = await collection.findOne({ _id: Dets.id });
    if (!Result) {
      return res.status(400).json({
        message: `Wrong Id.`,
        success: false,
      });
    }

    let history = await diffHistory.getDiffs(collectionName, Dets.id);
    let translate = await Helper.findOne({ name: "Translation" });

    let xmls = getXmls(history, translate.data);
    return res.status(201).send(xmls);

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
  FopHistoryGetById,
};
