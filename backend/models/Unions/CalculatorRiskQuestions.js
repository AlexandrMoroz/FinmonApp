const GroupOfQuestionsFactory = require("./GroupOfQuestionsFactory");
class CalculatorRiskQuestions {
  constructor(formData, selectGroupType) {
    let factory = new GroupOfQuestionsFactory(
      formData,
      "Risk",
      selectGroupType
    );
    this.group = factory.createGroup();
  }
  async calcGroupsForTest() {
    return await Promise.all(
      this.group.map(async (item) => {
        return item.calcAllQuestion();
      })
    );
  }
  async calcGroups() {
    let answers = await Promise.all(
      this.group.map(async (item) => {
        return item.calcAllQuestion();
      })
    );
    let acc = answers.reduce((accumulator, currentValue, index, array) => {
      if (currentValue.includes(true)) return accumulator + 1;
    }, 0);
    if (acc == 0) {
      return "Низький";
    } else if (acc == 1 || acc == 2) {
      return "Середній";
    } else if (acc == 3 || acc == 4) {
      return "Високий";
    }
  }
}

module.exports = CalculatorRiskQuestions;
