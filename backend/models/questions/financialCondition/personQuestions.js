function Question1() {
  let empType = this.result.EmploymentType;
  if (!empType || empType.length == 0) {
    return 1;
  }
  let order = [
    { key: "власник/співвласник бізнесу", value: 1.75 },
    { key: "підприємець", value: 1.5 },
    { key: "перша особа (керівник) юридичної особи", value: 1.25 },
    { key: "найманий працівник", value: 1.0 },
    { key: "пенсіонер", value: 0.75 },
    { key: "студент", value: 0.5 },
    { key: "не зайнятий (безробітний)", value: 0.25 },
    { key: "суспільний активіст/волонтер", value: 0.25 },
  ];
  let tempEmpType = [];
  empType.forEach((item) => {
      let orderElem = order.find((e) => {if(e.key === item) return e});
      tempEmpType.push(orderElem.value);
  });
  tempEmpType = tempEmpType.sort((a, b) => b - a);
  return tempEmpType[0];
}
function Question2() {
  let prop = this.result.Property;
  if (!prop || prop.length == 0) {
    return 0.5 ;
  }
  let order = [
    { key: "обладнання", value: 0.75 },
    { key: "транспортні засоби, що належать державній реєстрації", value: 1.0 },
    { key: "нерухомість", value: 1.25 },
    {
      key: "грошові кошти на рахунку в банках (у т.ч. на депозитних) за виключенням кредитних",
      value: 1.5,
    },
  ];
  let tempEmpType = [];

  prop.forEach((item) => {
    item.PropertyType.forEach((elem) => {
      let orderElem = order.find((e) => {if(e.key === elem) return e});
      tempEmpType.push(orderElem.value);
    });
  });
  tempEmpType = tempEmpType.sort((a, b) => b - a);
  return tempEmpType[0];
}
function Question3() {
  let avrprof = this.result.MonthIncome;
  if (!avrprof || avrprof < 2500) return 0.25;
  if (avrprof > 2500 && avrprof <= 5000) return 0.5;
  if (avrprof > 5000 && avrprof <= 10000) return 0.75;
  if (avrprof > 10000 && avrprof <= 20000) return 1.0;
  if (avrprof > 20000 && avrprof <= 50000) return 1.25;
  if (avrprof > 50000 && avrprof <= 100000) return 1.5;
  if (avrprof > 100000) return 1.75;
}

module.exports = [Question1, Question2, Question3];
