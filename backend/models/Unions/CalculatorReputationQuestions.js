const GroupOfQuestionsFactory = require("./GroupOfQuestionsFactory");
class CalculatorReputationQuestions {
  constructor(formData) {
    this.group = new GroupOfQuestionsFactory(formData, "Reputation").createGroup();
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
