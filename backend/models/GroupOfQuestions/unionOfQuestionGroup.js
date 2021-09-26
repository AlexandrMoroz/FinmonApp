const GroupOfQuestions = require("./groupOfQuestions");
const firstGroupOfQuestions = require("../Questions/firstGroupQuestion");
const secondGroupOfQuestions = require("../Questions/secondGroupQuestion");
const thirdGroupOfQuestions = require("../Questions/thirdGroupQuestion");
class UnionOfQuestionGroup {
  constructor(formData, selectGroupType) {
    this.groups = {
      INDIVIDUALS: new GroupOfQuestions(formData, [
        ...firstGroupOfQuestions.individual,
        ...secondGroupOfQuestions.individual,
        ...thirdGroupOfQuestions.individual,
      ]),
      LEGALENTITES: new GroupOfQuestions(formData, [
        ...firstGroupOfQuestions.legalEntity,
        ...secondGroupOfQuestions.legalEntity,
        ...thirdGroupOfQuestions.legalEntity,
      ]),
    };
    this.selectGroupType = selectGroupType;
    this.formData = formData;
  }

  async calcGroups() {
    return await this.groups[this.selectGroupType].calcAllQuestion();
  }
}

module.exports = UnionOfQuestionGroup;
