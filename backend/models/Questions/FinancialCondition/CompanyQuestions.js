const { DateDiffInMonth, ResolvePath } = require("../../../utils/helpers");

function Question1() {
  let govProc = this.result["GovProcentInCapital"];
  if (govProc) {
    if (govProc == 100) return 2.0;
  }
  let nonProf = ResolvePath(this.result, "CheckList.ClientIsNotProfitable");
  if (nonProf) return 0.5;
  let capital = this.result["BusinessCapital"];
  if (!capital || capital < 100000) return 0.5;
  if (capital >= 100000 && capital <= 1000000) return 0.75;
  if (capital >= 1000000 && capital <= 2000000) return 1.0;
  if (capital >= 2000000 && capital <= 3000000) return 1.25;
  if (capital >= 3000000) return 1.5;
}
function Question2() {
  let govProc = this.result["GovProcentInCapital"];
  if (govProc) {
    if (govProc == 100) return 2.0;
  }
  let regDate = this.result["DateOfRegistration"];
  if (!regDate) throw Error("Registration Date is empty");
  let mouthDiff = DateDiffInMonth(regDate);
  
  if (mouthDiff < 3) return 0.5;
  if (mouthDiff >= 3 && mouthDiff < 13) return 0.75;
  if (mouthDiff >= 13 && mouthDiff < 25) return 1.0;
  if (mouthDiff >= 25 && mouthDiff <= 36) return 1.25;
  if (mouthDiff > 36) return 1.5;
}
function Question3() {
  let employers = this.result["EmployersNum"];

  if (!employers) return 0.5;
  if (employers == 1) return 0.5;
  if (employers >= 2 && employers <= 4) return 0.75;
  if (employers >= 5 && employers <= 10) return 1.0;
  if (employers >= 11 && employers <= 20) return 1.25;
  if (employers > 20) return 1.5;
}
function Question4() {
  let director = this.result["Director"];
  let arr = [];
  if (director && director.length != 0) {
    arr.push(
      ...director.map((element) => {
        return element["IsVulnerablePerson"];
      })
    );
  }
  let owner = this.result["Owner"];
  if (owner && owner.length != 0) {
    arr.push(
      ...owner.map((element) => {
        return element["IsVulnerablePerson"];
      })
    );
  }
  return arr.includes(true) ? 0.5 : 1.0;
}
function Question5() {
  let MonthIncome = this.result["MonthIncome"];
  if (!MonthIncome || MonthIncome < 1000000) return 0.5;
  if (MonthIncome >= 1000000 && MonthIncome <= 5000000) return 0.75;
  if (MonthIncome >= 5000000 && MonthIncome <= 10000000) return 1.0;
  if (MonthIncome >= 10000000 && MonthIncome <= 20000000) return 1.25;
  if (MonthIncome > 20000000) return 1.5;
}
function Question6() {
  let MonthIncome = this.result["MonthIncome"];
  let clearMonthIncome = this.result["ClearMonthIncome"];

  if (!MonthIncome || !clearMonthIncome) return 1;
  let res = (clearMonthIncome / MonthIncome) * 100;
 
  if (res < 1) return 0.5;
  if (res >= 1 && res < 2) return 0.75;
  if (res >= 2 && res < 3) return 1.0;
  if (res >= 3 && res < 4) return 1.25;
  if (res >= 4) return 1.5;
}
module.exports = [
  Question1,
  Question2,
  Question3,
  Question4,
  Question5,
  Question6,
];
