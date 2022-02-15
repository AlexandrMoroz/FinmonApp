const factory = require("./groupOfQuestionsFactory");
const {
  RISK,
  VERY_HIGH_RISK,
  HIGH_RISK,
} = require("../../utils/helpers");

class CalculatorRiskQuestions {
  constructor(formData, selectGroupType) {
    this.VeryHishRisk = factory.createGroup(
      formData,
      RISK,
      VERY_HIGH_RISK
    );
    this.HishRisk = factory.createGroup(
      formData,
      RISK,
      HIGH_RISK
    );
    this.group = factory.createGroup(
      formData,
      RISK,
      selectGroupType
    );
  }
  async calcHighRisk() {
    return await this.HishRisk.calcAllQuestion();
  }
  async calcVeryHighRisk() {
    return await this.VeryHishRisk.calcAllQuestion();
  }
  async calcGroupsForTest() {
    return await Promise.all(
      this.group.map(async (item) => {
        return item.calcAllQuestion();
      })
    );
  }
  async calcGroups() {
    let VeryHighRisk = await this.calcVeryHighRisk();
    if (VeryHighRisk.includes(true)) {
      return "Неприйнятно високий (Винятковий список)";
    }
    let HighRisk = await this.calcHighRisk();
    if (HighRisk.includes(true)) {
      return "Високий (Винятковий список)";
    }
    console.log(VeryHighRisk)
    console.log(HighRisk)
    let answers = await Promise.all(
      this.group.map(async (item) => {
        return item.calcAllQuestion();
      })
    );
    
    let acc = answers.reduce((accumulator, currentValue, index, array) => {
      if (currentValue.includes(true)) return accumulator + 1;
      return accumulator;
    }, 0);
    console.log(acc)
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
