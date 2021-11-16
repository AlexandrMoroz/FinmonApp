const GroupOfQuestions = require("./groupOfQuestions");
const firstGroupOfQuestions = require("../Questions/Risk/firstGroupQuestion");
const secondGroupOfQuestions = require("../Questions/Risk/secondGroupQuestion");
const thirdGroupOfQuestions = require("../Questions/Risk/thirdGroupQuestion");

class UnionOfRiskQuestionGroup {
  constructor(formData, selectGroupType) {
    this.groups = {
      INDIVIDUALS: [
        firstGroupOfQuestions.individual,
        secondGroupOfQuestions.individual,
        thirdGroupOfQuestions.individual,
      ],
      LEGALENTITES: [
        firstGroupOfQuestions.legalEntity,
        secondGroupOfQuestions.legalEntity,
        thirdGroupOfQuestions.legalEntity,
      ],
    };
    this.selectGroupType = selectGroupType;
    this.formData = formData;
  }
  async calcGroupsForTest() {
    return await Promise.all(
      this.groups[this.selectGroupType].map(async (item) => {
        return await new GroupOfQuestions(
          this.formData,
          item
        ).calcAllQuestion();
      })
    );
  }
  async calcGroups() {
    let arrOfArr = await Promise.all(
      this.groups[this.selectGroupType].map(async (item) => {
        return await new GroupOfQuestions(
          this.formData,
          item
        ).calcAllQuestion();
      })
    );
    let acc = arrOfArr.reduce((accumulator, currentValue, index, array) => {
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

module.exports = UnionOfRiskQuestionGroup;
