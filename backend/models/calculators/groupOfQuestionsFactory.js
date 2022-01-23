const companyQuestions = require("../questions/financialCondition/companyQuestions");
const personQuestions = require("../questions/financialCondition/personQuestions");
const individualQuestions = require("../questions/financialCondition/individualQuestions");
const reputationQuestions = require("../questions/reputation/questions");

const firstGroupOfQuestions = require("../questions/risk/firstGroupQuestion");
const secondGroupOfQuestions = require("../questions/risk/secondGroupQuestion");
const thirdGroupOfQuestions = require("../questions/risk/thirdGroupQuestion");

const GroupOfQuestions = require("./groupOfQuestions");
class GroupOfQuestionsFactory {
  constructor(formData, calcType, specificType) {
    if (!formData.result) {
      throw new Error("FormData is empty");
    }
    this.formData = formData;
    this.calcType = calcType;
    this.specificType = specificType;
  }
  createGroup() {
    if (this.calcType == "FinansialRisk") {
      if (this.formData.result["FOP"]) {
        return new GroupOfQuestions(this.formData, individualQuestions);
      }
      if (this.formData.result["INN"]) {
        return new GroupOfQuestions(this.formData, personQuestions);
      }
      if (this.formData.result["ClientCode"]) {
        return new GroupOfQuestions(this.formData, companyQuestions);
      }
    }
    if (this.calcType == "Reputation") {
      return new GroupOfQuestions(this.formData, reputationQuestions);
    }
    if (this.calcType == "Risk") {
      if (this.specificType == "INDIVIDUALS") {
        return [
          new GroupOfQuestions(this.formData, firstGroupOfQuestions.individual),
          new GroupOfQuestions(
            this.formData,
            secondGroupOfQuestions.individual
          ),
          new GroupOfQuestions(this.formData, thirdGroupOfQuestions.individual),
        ];
      }
      if (this.specificType == "LEGALENTITES") {
        return [
          new GroupOfQuestions(
            this.formData,
            firstGroupOfQuestions.legalEntity
          ),
          new GroupOfQuestions(
            this.formData,
            secondGroupOfQuestions.legalEntity
          ),
          new GroupOfQuestions(
            this.formData,
            thirdGroupOfQuestions.legalEntity
          ),
        ];
      }
    }
  }
}

module.exports = GroupOfQuestionsFactory;
