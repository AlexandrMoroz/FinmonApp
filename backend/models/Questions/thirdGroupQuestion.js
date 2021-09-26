const { ClosedQuestion } = require("../../utils/helpers");
function Question23() {
  return ClosedQuestion.call(this, "CheckList.ClientVIPService");
}
function Question24() {
  return ClosedQuestion.call(
    this,
    "CheckList.HasCreditThatGuarantedAnotherFinInstгuments"
  );
}
function Question25() {
  return ClosedQuestion.call(this, "CheckList.ClientUseFiduciaryService");
}

function Question26() {
  
  return ClosedQuestion.call(this, "ClientUseProduct")||ClosedQuestion.call(this, "CheckList.ClientUseProduct");
}

module.exports = {
  individual: [Question23, Question24, Question25, Question26],
  legalEntity: [Question24, Question26],
};
