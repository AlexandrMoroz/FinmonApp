const Helper = require("../../helper");
function Question19() {
  let blackList = [
    "Албания",
    "Барбадос",
    "Ботсвана",
    "Буркина-Фасо",
    "Камбоджа",
    "Каймановы острова",
    "Гаити",
    "Ямайка",
    "Мальта",
    "Маврикий",
    "Марокко",
    "Мьянма",
    "Никарагуа",
    "Пакистан",
    "Панама",
    "Филиппины",
    "Сенегал",
    "южный Судан",
    "Сирия",
    "Уганда",
    "Йемен",
    "Зимбабве",
    "Гана",
  ];
  let owners = this.result["Owner"];
  if (owners && owners.length!=0) {
    let flag = owners.some((item) => {
      let regCountry = item["Regist"].Country;
      let liveCountry = item["Live"].Country;
      if (blackList?.includes(regCountry) || blackList?.includes(liveCountry)) {
        return true;
      }
    });
    if (flag) return true;
  }
  let registCountry =
    this.result["RegistPlace"]?.Country || this.result["Regist"]?.Country;
  let liveCountry =
    this.result["ActualLocation"]?.Country || this.result["Live"]?.Country;

  if (
    (registCountry && blackList.includes(registCountry)) ||
    (liveCountry && blackList.includes(liveCountry))
  ) {
    return true;
  }

  return false;
}
function Question20() {
  let blackList = [
    "Іран",
    "Північна Корея",
    "Албанія",
    "Барбадос",
    "Ботсвана",
    "Камбоджа",
    "Ямайка",
    "Гаїті",
    "Мальта",
    "Маврикій",
    "М'янма",
    "Нікарагуа",
    "Пакистан",
    "Панама",
    "Філіппіни",
    "Південний Судан",
    "Сирія",
    "Уганда",
    "Ємен",
    "Зімбабве",
  ];
  let liveCountry =
    this.result["ActualLocation"]?.Country || this.result["Live"]?.Country;
  return liveCountry && blackList.includes(liveCountry);
}

async function Question21() {
  let OfshoreCountry = await Helper.findOne({ name: "OfshoreCountry" });
  if(!OfshoreCountry && OfshoreCountry.length == 0){
    throw Error("OfShoreCountry helper is undefided")
  }
  let owners = this.result["Owner"];
  if (owners) {
    let flag = owners.some((item) => {
      let regCountry = item["Regist"]?.Country;
      let liveCountry = item["Live"]?.Country;
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
    this.result["RegistPlace"]?.Country || this.result["Regist"]?.Country;
  let liveCountry =
    this.result["ActualLocation"]?.Country || this.result["Live"]?.Country;

  if (
    (registCountry && OfshoreCountry.result.includes(registCountry)) ||
    (liveCountry && OfshoreCountry.result.includes(liveCountry))
  ) {
    return true;
  }
  return false;
}

function Question22() {
  let shoudinclude = "Россія";
  let regist = this.result["RegistPlace"] || this.result["Regist"];
  return regist?.Country == shoudinclude;
}

module.exports = {
  individual: [Question19, Question21, Question22],
  legalEntity: [Question19, Question20, Question21, Question22],
};
