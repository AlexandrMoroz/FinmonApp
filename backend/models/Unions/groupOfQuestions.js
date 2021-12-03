class GroupOfQuestions {
  constructor(formData, arrOfQuestions) {
    if (!formData.result) {
      throw new Error("FormData is empty");
    }
    this.result = formData.result;
    this.id = formData._id;
    this.arrOfQuestions = arrOfQuestions;
  }
  async calcAllQuestion() {
    return await Promise.all(
      this.arrOfQuestions.map((item) => {
        return item.call(this);
      })
    );
  }
}

const INDIVIDUALS = "INDIVIDUALS";
const LEGALENTITES = "LEGALENTITES";
const PERSON = "PERSON";
module.exports = GroupOfQuestions;
module.exports.Types = { INDIVIDUALS, LEGALENTITES, PERSON };
