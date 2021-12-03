const { DateDiffInDays } = require("../../../utils/helpers");
function Question1() {
  let regDate = this.result["FOP"]?.GovRegDocDateRelise;
  if (!regDate) {
    return 1;
  }
  let mounth = DateDiffInDays(new Date(regDate), new Date())/30;
  if (mounth < 3) return 0.5;
  if (mounth >= 4 && mounth <= 12) return 0.75;
  if (mounth >= 13 && mounth <= 24) return 1.0;
  if (mounth >= 25 && mounth <= 36) return 1.25;
  if (mounth > 36) return 1.5;
}
function Question2() {
  let empNum = this.result["EmployersNum"];
  if (!empNum) return 0.5;
  if (empNum >= 1 && empNum <= 2) return 0.75;
  if (empNum >= 3 && empNum <= 4) return 1.0;
  if (empNum >= 5 && empNum <= 10) return 1.25;
  if (empNum > 10) return 1.5;
}
function Question3() {
  let prop = this.result["Property"];
  if (!prop || prop.length == 0) {
    return 1;
  }
  let order = [
    { key: "не має", value: 0.5 },
    { key: "товари в обороті та/або нематеріальні активи", value: 0.75 },
    { key: "обладнання", value: 1.0 },
    {
      key: "транспортні засоби, що належать державній реєстрації",
      value: 1.25,
    },
    { key: "нерухомість", value: 1.5 },
  ];
  let tempEmpType = [];
  order.forEach((elem) => {
    let index = prop.findIndex(
      (item, index, arr) => item.PropertyType == elem.key
    );
    if (index != -1) {
      tempEmpType[index] = order[index];
    }
  });
  tempEmpType = tempEmpType.filter((a) => a?.value);
  return tempEmpType[0].value;
}
function Question4() {
  let avrprof = this.result["MounthIncome"];
  if (!avrprof || avrprof < 500000) return 0.5;
  if (avrprof > 500000 && avrprof <= 1000000) return 0.75;
  if (avrprof > 1000000 && avrprof <= 5000000) return 1.0;
  if (avrprof > 5000000 && avrprof <= 10000000) return 1.25;
  if (avrprof > 10000000) return 1.5;
}
module.exports = [Question1, Question2, Question3,Question4];
