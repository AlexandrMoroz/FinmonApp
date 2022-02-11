const diffHistory = require("mongoose-diff-history/diffHistory");
const { Formater } = require("../utils/formater");
const XLSXHistory = require("../utils/history");
const HelperService = require("../services/helper");

class HistoryService {
  constructor() {
    if (HistoryService._instance) {
      return HistoryService._instance;
    }
    HistoryService._instance = this;
  }
  async getJSONHistory(collectionName, id) {
    let history = await diffHistory.getDiffs(collectionName, id);
    let translate_arr = await HelperService.getTranslate();
    let formater = new Formater(translate_arr);
    
    return history.map((item) => {
      return {
        diff: formater.format(item.diff),
        user: item.user,
        createdAt: item.createdAt,
      };
    });
  }
  async getXlSXHistory(collectionName, id) {
    let history = await diffHistory.getDiffs(collectionName, id);
    let translate_arr = await HelperService.getTranslate();
    let xmls = new XLSXHistory(translate_arr);
    return xmls.createHistoryBuf(history);
  }
}

module.exports = new HistoryService();