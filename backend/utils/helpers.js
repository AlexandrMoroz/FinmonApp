var moment = require("moment");
const ResolvePath = (object, path, defaultValue) => {
  if (isEmpty(object) || !path) return object;
  return path.split(".").reduce((o, p) => (o ? o[p] : defaultValue), object);
};

function isEmpty(obj) {
  for (var i in obj) return false;
  return true;
}

function OperationShoudinclude(nameOfField) {
  let answer = this.result.Operations;
  if (answer == undefined || answer.lenght == 0) return false;
  return answer.map((item) => item.Operation == nameOfField).includes(true);
}
function ClosedQuestion(nameOfField) {
  let answer = ResolvePath(this.result, nameOfField);
  if (answer == undefined) return false;
  if (answer) return true;
  else return false;
}
function DateDiffInDays(a) {
  var c = moment(a);
  return moment().diff(c, "days");
}
function DateDiffInMonth(dateFrom) {
  var c = moment(dateFrom);
  return moment().diff(c, "months");
}
const COMPANY = "COMPANY";
const PERSON = "PERSON";
const FINANSIAL_RISK = "FinansialRisk";
const REPUTATION = "Reputation";
const RISK = "Risk";

const HIGH_RISK = "HIGHRISK";
const VERY_HIGH_RISK = "VERYHIGHRISK";

module.exports = {
  ResolvePath,
  OperationShoudinclude,
  ClosedQuestion,
  DateDiffInDays,
  DateDiffInMonth,
  COMPANY,
  PERSON,
  VERY_HIGH_RISK,
  HIGH_RISK,
  FINANSIAL_RISK,
  REPUTATION,
  RISK,
  getService(ServiceType) {
    switch (ServiceType) {
      case COMPANY:
        return require("../services/company");
      case PERSON:
        return require("../services/person");
    }
  },
};
