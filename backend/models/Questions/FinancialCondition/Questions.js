const { DateDiffInMounth } = require("../../../utils/helpers");

function Question1() {
  let govProc = this.result["GovProcentInCapital"];
  if (govProc) {
    if (govProc == 100) return 2.0;
  }
  let nonProf = this.result["ClientIsNotProfitable"];
  if (nonProf) return 0.5;
  let capital = this.result["BusinessCapital"];
  if (!capital || capital < 100000) return 0.5;
  if (capital >= 100000 && capital < 1000000) return 0.75;
  if (capital >= 1000000 && capital < 2000000) return 1.0;
  if (capital >= 2000000 && capital < 3000000) return 1.25;
  if (capital >= 3000000) return 1.5;
}
function Question2() {
  let govProc = this.result["GovProcentInCapital"];
  if (govProc) {
    if (govProc == 100) return 2.0;
  }
  let regDate = this.result["DateOfRegistration"];
  if (!regDate) throw Error("Registration Date is empty");
  let mouthDiff = DateDiffInMounth(new Date(regDate), new Date());
  if (mouthDiff < 3) return 0.5;
  if (mouthDiff >= 3 && mouthDiff <= 12) return 0.75;
  if (mouthDiff >= 13 && mouthDiff <= 24) return 1.0;
  if (mouthDiff >= 25 && mouthDiff <= 36) return 1.25;
  if (mouthDiff > 36) return 1.5;
}
function Question3() {
  let employers = this.result["EmployersNum"];
  if (!employers) return 0;
  if (employers == 1) return 0.5;
  if (employers >= 2 && employers <= 4) return 0.75;
  if (employers >= 5 && employers <= 10) return 1.0;
  if (employers >= 11 && employers <= 20) return 1.25;
  if (employers > 20) return 1.5;
}
function Question4() {
  let director = this.result["Director"];
  let arr = [];
  if (!director && director.length != 0) {
    arr.push(
      director.map((element) => {
        return element["VulnerablePeople"];
      })
    );
  }
  let owner = this.result["Owner"];
  if (!owner && owner.length != 0) {
    arr.push(
      owner.map((element) => {
        return element["VulnerablePeople"];
      })
    );
  }
  return arr.includes(true) ? 0.5 : 1.0;
}
function Question5() {
  let mounthIncome = this.result["MounthIncome"];
  if (!mounthIncome || mounthIncome < 1000000) return 0.5;
  if (mounthIncome >= 1000000 && mounthIncome <= 5000000) return 0.75;
  if (mounthIncome >= 5000000 && mounthIncome <= 10000000) return 1.0;
  if (mounthIncome >= 10000000 && mounthIncome <= 20000000) return 1.25;
  if (mounthIncome > 20000000) return 1.5;
}
function Question6() {
  let mounthIncome = this.result["MounthIncome"];
  let clearMounthIncome = this.result["ClearMounthIncome"];
  if (!mounthIncome || !clearMounthIncome) return 0;
  let res = (clearMounthIncome / mounthIncome) * 100;
  if (res < 1) return 0.5;
  if (res >= 1.0 && res <= 1.99) return 0.75;
  if (res >= 2.0 && res <= 2.99) return 1.0;
  if (res >= 3.0 && res <= 3.99) return 1.25;
  if (res > 4) return 1.5;
}
module.exports = [
  Question1,
  Question2,
  Question3,
  Question4,
  Question5,
  Question6,
];
