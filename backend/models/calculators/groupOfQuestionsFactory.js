const companyQuestions = require("../questions/financialCondition/companyQuestions");
const personQuestions = require("../questions/financialCondition/personQuestions");
const individualQuestions = require("../questions/financialCondition/individualQuestions");
const reputationQuestions = require("../questions/reputation/questions");

const firstGroupOfQuestions = require("../questions/risk/firstGroupQuestion");
const secondGroupOfQuestions = require("../questions/risk/secondGroupQuestion");
const thirdGroupOfQuestions = require("../questions/risk/thirdGroupQuestion");

const exclusionQuestions = require("../questions/risk/exclusionGroupQuestion");

const {
  FINANSIAL_RISK,
  REPUTATION,
  RISK,
  COMPANY,
  PERSON,
  HIGH_RISK,
  VERY_HIGH_RISK,
} = require("../../utils/helpers");

const GroupOfQuestions = require("./groupOfQuestions");
class GroupOfQuestionsFactory {
  constructor() {
    if (GroupOfQuestionsFactory._instance) {
      return GroupOfQuestionsFactory._instance;
    }
    GroupOfQuestionsFactory._instance = this;
  }

  createGroup(formData, calcType, spType) {
    if (!formData.result) {
      throw new Error("FormData is empty");
    }
    if (calcType === FINANSIAL_RISK) {
      if (formData.result["FOP"]) {
        return new GroupOfQuestions(formData, individualQuestions);
      }
      if (formData.result["Family"]) {
        return new GroupOfQuestions(formData, personQuestions);
      }
      if (formData.result["ClientCode"]) {
        return new GroupOfQuestions(formData, companyQuestions);
      }
    }
    if (calcType === REPUTATION) {
      return new GroupOfQuestions(formData, reputationQuestions);
    }
    if (calcType === RISK) {
      if (spType === PERSON) {
        return [
          new GroupOfQuestions(formData, firstGroupOfQuestions.individual),
          new GroupOfQuestions(formData, secondGroupOfQuestions.individual),
          new GroupOfQuestions(formData, thirdGroupOfQuestions.individual),
        ];
      }
      if (spType === COMPANY) {
        return [
          new GroupOfQuestions(formData, firstGroupOfQuestions.legalEntity),
          new GroupOfQuestions(formData, secondGroupOfQuestions.legalEntity),
          new GroupOfQuestions(formData, thirdGroupOfQuestions.legalEntity),
        ];
      }
      if (spType === HIGH_RISK) {
        return new GroupOfQuestions(formData, exclusionQuestions.HighRisk);
      }
      if (spType === VERY_HIGH_RISK) {
        return new GroupOfQuestions(formData, exclusionQuestions.VeryHighRisk);
      }
    }
  }
}

module.exports = new GroupOfQuestionsFactory();
