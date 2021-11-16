const questions = require("../Questions/Risk/Questions");
const GroupOfQuestions = require("./groupOfQuestions");
class UnionOfFinansialRiskQuestions {
  constructor(formData) {
    this.questions = {
      INDIVIDUALS: new GroupOfQuestions(formData, questions),
      LEGALENTITES: new GroupOfQuestions(formData, questions),
    };
    this.formData = formData;
  }
  async calcGroupsForTest() {
    return await this.questions.calcAllQuestion();
  }

  async calcGroups() {
    let arrOfArr = await this.questions.calcAllQuestion();
    let acc = arrOfArr.reduce((accumulator, currentValue, index, array) => {
      return accumulator + currentValue;
    }, 0);

    if (acc == 0 || acc == 1) {
      return "Позитивна";
    } else if (acc == 2 || acc == 3) {
      return "Негативна";
    }
  }
}

module.exports = UnionOfFinansialRiskQuestions;
