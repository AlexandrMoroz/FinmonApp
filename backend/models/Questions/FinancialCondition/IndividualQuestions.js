const { DateDiffInMonth } = require("../../../utils/helpers");
function Question1() {
  let regDate = this.result.FOP?.GovRegDocDateRelise;
  if (!regDate) {
    return 1;
  }
  let Month = DateDiffInMonth(regDate);

  if (Month <= 3) return 0.5;
  if (Month >= 4 && Month <= 12) return 0.75;
  if (Month >= 13 && Month <= 24) return 1.0;
  if (Month >= 25 && Month <= 36) return 1.25;
  if (Month > 36) return 1.5;
}
function Question2() {
  let empNum = this.result.EmployersNum;
  if (!empNum) return 0.5;
  if (empNum >= 1 && empNum <= 2) return 0.75;
  if (empNum >= 3 && empNum <= 4) return 1.0;
  if (empNum >= 5 && empNum <= 10) return 1.25;
  if (empNum > 10) return 1.5;
}
function Question3() {
  let prop = this.result.Property;
  if (!prop || prop.length == 0) {
    return 0.5;
  }
  let order = [
    { key: "товари в обороті та/або нематеріальні активи", value: 0.75 },
    { key: "обладнання", value: 1.0 },
    {
      key: "транспортні засоби, що належать державній реєстрації",
      value: 1.25,
    },
    { key: "нерухомість", value: 1.5 },
  ];
  let tempEmpType = [];

  prop.forEach((item) => {
    item.PropertyType.forEach((elem) => {
      let orderElem = order.find((e) => {
        if (e.key === elem) return e;
      });
      tempEmpType.push(orderElem.value);
    });
  });
  tempEmpType = tempEmpType.sort((a, b) => b - a);
  return tempEmpType[0];
}
function Question4() {
  let avrprof = this.result.MonthIncome;
  if (!avrprof || avrprof < 500000) return 0.5;
  if (avrprof > 500000 && avrprof <= 1000000) return 0.75;
  if (avrprof > 1000000 && avrprof <= 5000000) return 1.0;
  if (avrprof > 5000000 && avrprof <= 10000000) return 1.25;
  if (avrprof > 10000000) return 1.5;
}
module.exports = [Question1, Question2, Question3, Question4];
