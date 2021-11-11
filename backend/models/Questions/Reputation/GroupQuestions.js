const { ClosedQuestion } = require("../../../utils/helpers");

function Question1() {
  return ClosedQuestion.call(this, "CheckList.HasQuestionFromPolice");
}
function Question2() {
  return ClosedQuestion.call(this, "CheckList.HasQuestionFromFinmon");
}
function Question3() {
  return ClosedQuestion.call(this, "CheckList.HasBadReputation");
}

module.exports = [Question1, Question2, Question3];
