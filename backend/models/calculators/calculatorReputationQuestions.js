const factory = require("./groupOfQuestionsFactory");
const { REPUTATION } = require("../../utils/helpers");

class CalculatorReputationQuestions {
  constructor(formData) {
    this.group = factory.createGroup(formData, REPUTATION);
  }
  async calcGroupsForTest() {
    return await this.group.calcAllQuestion();
  }
  async calcGroups() {
    let answers = await this.group.calcAllQuestion();
    let acc = answers.reduce((accumulator, currentValue, index, array) => {
      return accumulator + currentValue;
    }, 0);
    if (acc == 0 || acc == 1) {
      return "Позитивна";
    } else if (acc == 2 || acc == 3) {
      return "Негативна";
    }
  }
}

module.exports = CalculatorReputationQuestions;
