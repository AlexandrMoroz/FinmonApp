const Helper = require("../models/helper");
const { COMPANY, PERSON } = require("./serviceshelpers");
class HelperService {
  constructor() {
    if (HelperService._instance) {
      return HelperService._instance;
    }
    HelperService._instance = this;
  }
  async create(name, result) {
    return await new Helper({ name, result }).save();
  }
  async getByName(name) {
    return (await Helper.findOne({ name: name })).result;
  }
  async getAllFATFList() {
    let black = await this.getBlackFATFList();
    let gray = await this.getGrayFATFList();
    return [...black, ...gray];
  }
  async getBlackFATFList() {
    return (await Helper.findOne({ name: "blackCountryInFATF" })).result;
  }
  async getGrayFATFList() {
    return (await Helper.findOne({ name: "grayCountryInFATF" })).result;
  }
  async getCountries() {
    return (await Helper.findOne({ name: "grayCountryInFATF" })).result;
  }
  async getOfshore() {
    return (await Helper.findOne({ name: "ofshoreCountry" })).result;
  }
  async getTranslate() {
    return (await Helper.findOne({ name: "translate" })).result;
  }
  async getOrder(type) {
    switch (type) {
      case COMPANY:
        return require("../mock/companyOrder.json");
      case PERSON:
        return require("../mock/personOrder.json");
    }
  }
  async deleteAll() {
    await Helper.deleteMany({});
  }
}
module.exports = new HelperService();
