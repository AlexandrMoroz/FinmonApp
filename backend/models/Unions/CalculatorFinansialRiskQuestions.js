const GroupOfQuestionsFactory = require("./GroupOfQuestionsFactory");
class CalculatorFinansialRiskQuestions {
  constructor(formData) {
    let factory = new GroupOfQuestionsFactory(formData, "FinansialRisk");
    this.group = factory.createGroup();
   
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
