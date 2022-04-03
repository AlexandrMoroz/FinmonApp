const Helper = require("../../helper");
const helperService = require("../../../services/helper");
async function Question19() {

  let list =  await helperService.getAllFATFList();
  let owners = this.result.Owner;
  if (owners && owners.length != 0) {
    let flag = owners.some((item) => {
      let regCountry = item?.Regist.Country;
      let liveCountry = item?.Live.Country;
      if (list?.includes(regCountry) || list?.includes(liveCountry)) {
        return true;
      }
    });
    if (flag) return true;
  }
  let registCountry =
    this.result.RegistPlace?.Country || this.result.Regist?.Country;
  let liveCountry =
    this.result.ActualLocation?.Country || this.result.Live?.Country;
  if (
    (registCountry && list.includes(registCountry)) ||
    (liveCountry && list.includes(liveCountry))
  ) {
    return true;
  }

  return false;
}
async function Question20() {
  let blackList = await Helper.findOne({ name: "blackCountryInFATF" });
  let grayList = await Helper.findOne({ name: "grayCountryInFATF" });
  let list = [...blackList.result, ...grayList.result];
  let liveCountry = this.result.ActualLocation?.Country;

  return liveCountry && list.includes(liveCountry);
}

async function Question21() {
  let OfshoreCountry = await Helper.findOne({ name: "ofshoreCountry" });
  if (!OfshoreCountry && OfshoreCountry.result.length == 0) {
    throw Error("ofShoreCountry helper is undefided");
  }
  let owners = this.result.Owner;
  if (owners) {
    let flag = owners.some((item) => {
      let regCountry = item?.Regist?.Country;
      let liveCountry = item?.Live?.Country;
      if (
        OfshoreCountry.result.includes(regCountry) ||
        OfshoreCountry.result.includes(liveCountry)
      ) {
        return true;
      }
    });
    if (flag) return true;
  }
  let registCountry =
    this.result.RegistPlace?.Country || this.result.Regist?.Country;
  let liveCountry =
    this.result.ActualLocation?.Country || this.result.Live?.Country;

  if (
    (registCountry && OfshoreCountry.result.includes(registCountry)) ||
    (liveCountry && OfshoreCountry.result.includes(liveCountry))
  ) {
    return true;
  }
  return false;
}

function Question22() {
  let shoudinclude = "Російська Федерація";
  let regist = this.result.RegistPlace || this.result.Regist;
  let liveCountry = this.result.ActualLocation || this.result.Live;

  let owners = this.result.Owner;
  if (owners) {
    let flag = owners.some((item) => {
      let regCountry = item?.Regist?.Country;
      let liveCountry = item?.Live?.Country;
      return regCountry == shoudinclude || liveCountry == shoudinclude;
    });
    if (flag) return true;
  }
  
  return (
    regist?.Country == shoudinclude || liveCountry?.Country == shoudinclude
  );
}

module.exports = {
  individual: [Question19, Question21, Question22],
  legalEntity: [Question19, Question20, Question21, Question22],
};
