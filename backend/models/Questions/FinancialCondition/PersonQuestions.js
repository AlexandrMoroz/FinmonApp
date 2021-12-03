function Question1() {
  let empType = this.result["EmploymentType"];
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
  empType.forEach((elem) => {
    let index = order.findIndex((item, index, arr) => item.key == elem);
    tempEmpType[index] = order[index];
  });
  tempEmpType = tempEmpType.filter((a) => a);

  return tempEmpType[0].value;
}
function Question2() {
  let prop = this.result["Property"];
  if (!prop || prop.length == 0) {
    return 1;
  }
  let order = [
    { key: "не має", value: 0.5 },
    { key: "обладнання", value: 0.75 },
    { key: "транспортні засоби, що належать державній реєстрації", value: 1.0 },
    { key: "нерухомість", value: 1.25 },
    {
      key: "грошові кошти на рахунку в банках (у т.ч. на депозитних) за виключенням кредитних",
      value: 1.5,
    },
  ];
  let tempEmpType = [];
  prop.forEach((elem) => {
    let index = order.findIndex(
      (item, index, arr) => item.key == elem.PropertyType
    );
    tempEmpType[index] = order[index];
  });
  tempEmpType = tempEmpType.filter((a) => a);

  return tempEmpType[0].value;
}
function Question3() {
  let avrprof = this.result["MounthIncome"];
  if (!avrprof || avrprof < 2500) return 0.25;
  if (avrprof > 2500 && avrprof <= 5000) return 0.5;
  if (avrprof > 5000 && avrprof <= 10000) return 0.75;
  if (avrprof > 10000 && avrprof <= 20000) return 1.0;
  if (avrprof > 20000 && avrprof <= 50000) return 1.25;
  if (avrprof > 50000 && avrprof <= 100000) return 1.5;
  if (avrprof > 100000) return 1.75;
}

module.exports = [Question1, Question2, Question3];
