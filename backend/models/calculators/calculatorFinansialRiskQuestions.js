const factory = require("./groupOfQuestionsFactory");
const { FINANSIAL_RISK } = require("../../utils/helpers");

class CalculatorFinansialRiskQuestions {
  constructor(formData) {
    this.group = factory.createGroup(formData, FINANSIAL_RISK);
  }
  async calcGroupsForTest() {
    return await this.group.calcAllQuestion();
  }
  async calcGroups() {
    let answers = await this.group.calcAllQuestion();
    let acc = answers.reduce((accumulator, currentValue, index, array) => {
      return accumulator * currentValue;
    }, 0);
    if (acc > 0.5) {
      return "Задовільно";
    } else if (acc < 0.5) {
      return "Незадовільно";
    }
  }
}

module.exports = CalculatorFinansialRiskQuestions;
