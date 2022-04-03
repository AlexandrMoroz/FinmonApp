const { ClosedQuestion } = require("../../../utils/helpers");
const helperService = require("../../../services/helper");
function Question1() {
  return ClosedQuestion.call(this, "CheckList.CantDoFinmonJob");
}
function Question2() {
  return ClosedQuestion.call(
    this,
    "CheckList.HasInfoThatCompanyIsTaxFroudCompany"
  );
}
async function Question3() {
  let list = await helperService.getAllFATFList();

  let registCountry =
    this.result.RegistPlace?.Country || this.result.Regist?.Country;
  let liveCountry =
    this.result.ActualLocation?.Country || this.result.Live?.Country;

  return (
    (registCountry && list.includes(registCountry)) ||
    (liveCountry && list.includes(liveCountry))
  );
}
function Question4() {
  return ClosedQuestion.call(this, "CheckList.IsTerrorist");
}
function Question5() {
  let isResident = this.result.IsResident;
  let typesOfBusiness=    this.result.TypesOfBusiness || this.result.FOP?.TypesOfBusiness;
  if (!typesOfBusiness) {
    return false;
  }
  return typesOfBusiness.includes("фінансові послуги") && !isResident;
}
function Question6() {
  let isResident = this.result.IsResident;
  let pep = this.result.PEP;
  if (!pep) {
    return false;
  }
  return pep.length != 0 && !isResident;
}
function Question7() {
  return ClosedQuestion.call(this, "CheckList.IsSanction");
}
async function Question8() {
  let ofshore = await helperService.getOfshore();

  let registCountry =
    this.result.RegistPlace?.Country || this.result.Regist?.Country;
  let liveCountry =
    this.result.ActualLocation?.Country || this.result.Live?.Country;
  if (registCountry && liveCountry)
    return ofshore.includes(registCountry) || ofshore.includes(liveCountry);
}
function Question9() {
  let typesOfBusiness =
    this.result.TypesOfBusiness || this.result.FOP?.TypesOfBusiness;

  if (!typesOfBusiness) return false;

  return typesOfBusiness.includes(
    "діяльність, пов'язана з віртуальними активами (є постачальником послуг, пов'язаних з обігом віртуальних активів)"
  );
}
function Question10() {
  return ClosedQuestion.call(this, "CheckList.HasContractWithFATFOwner");
}

module.exports.VeryHighRisk = [Question1, Question2];
module.exports.HighRisk = [
  Question3,
  Question4,
  Question5,
  Question6,
  Question7,
  Question8,
  Question9,
  Question10,
];
