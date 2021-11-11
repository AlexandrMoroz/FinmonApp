const {
  ResolvePath,
  OperationShoudinclude,
  ClosedQuestion,
  DateDiffInDays,
} = require("../../../utils/helpers");
const Helper = require("../../helper");
const { Formater, OPERATIONS } = require("../../../utils/formater");
const diffHistory = require("mongoose-diff-history/diffHistory");

function Question1() {
  const shoudInclude = [
    "консалтингові послуги",
    "бухгалтерські послуги",
    "послуги із заснування суб'єктів господарювання",
    "послуги із відкриття рахунку в банку від свого імені для здійснення фінансових операцій від імені клієнта",
  ];
  let answer =
    this.result["TypesOfBusiness"] ||
    ResolvePath(this.result, "FOP.TypesOfBusiness");
  if (!answer) return false;
  return answer.some((item) => shoudInclude.includes(item.trim()));
}
function Question2() {
  let regDate = this.result["DateOfRegistration"];
  if (!regDate) return false;
  let result = DateDiffInDays(new Date(regDate), new Date());
  return result <= 180;
}
function Question3() {
  return ClosedQuestion.call(this, "CheckList.ClientProfessionIsDifferent");
}
function Question4() {
  const shoudInclude = [
    "азартні ігри, лотереї",
    "послуги інкасації",
    "діяльність, якій притаманний високий рівень обігу готівки",
    "торгівля нерухомістю, предметами розкоші, антикваріатом, творами мистецтва",
    "торгівля дорогоцінними металами та камінням",
    "виробництво та/або торгівля зброєю, боєприпасами, військовою технікою та військовими машинами (її частинами)",
    "діяльність, пов'язана із виробництвом та/або торгівлею матеріалами ядерних реакторів",
    "діяльність професійних спортивних клубів (у тому числі міжнародні спортивні організації)",
    "послуги з перестрахування",
    "посередницькі послуги з торгівлі іноземною валютою (наприклад, дилери Forex)",
    "надання послуг, які важко документально підтвердити, що вони насправді були надані (наприклад, рекламні, маркетингові, консалтингові послуги, послуги з дослідження ринку, розроблення та обслуговування IT-рішень)",
    "інвестиційні послуги та допоміжні інвестиційні послуги [за винятком випадків, коли постачальник послуг ліцензований та є об'єктом нагляду з питань ПВК/ФТ з боку відповідного наглядового органу держави (крім держав, віднесених до переліку держав, що не виконують рекомендації FATF (чорний список), та які мають стратегічні недоліки у сфері ПВК/ФТ відповідно до заяв FATF (сірий список)]",
    "торгівля бінарними опціонами",
    "діяльність, пов'язана з віртуальними активами (є постачальником послуг, пов'язаних з обігом віртуальних активів)",
    "діяльність неприбуткових організацій, у тому числі благодійна діяльність, діяльність релігійних організацій, політичних партій (крім ОСББ)",
  ];
  let answer =
    this.result["TypesOfBusiness"] ||
    ResolvePath(this.result, "FOP.TypesOfBusiness");

  if (!answer) return false;
  return answer.some((item) => shoudInclude.includes(item.trim()));
}
function Question5() {
  const shoudInclude = [
    "виробництво та/або торгівля фармацевтичними продуктами або наркотичними речовинами (прекурсорами)",
    "виробництво та/або торгівля зброєю, боєприпасами, військовою технікою та військовими машинами (її частинами)",
    "видобуток руд та/або дорогоцінного каміння",
    "видобуток сирої нафти, природного газу та/або виробництво нафтопродуктів",
    "види діяльності, які передбачають отримання спеціальних дозволів на користування надрами в межах території України, її континентального шельфу та виключної (морської) економічної зони",
    "державні закупівлі",
  ];
  let answer = //?
    this.result["TypesOfBusiness"] ||
    ResolvePath(this.result, "FOP.TypesOfBusiness");

  if (!answer) return false;
  return answer.some((item) => shoudInclude.includes(item.trim()));
}
function Question6() {
  let answer = this.result["DateOfFirstBissnesContact"];
  if (!answer) return false;
  let result = DateDiffInDays(new Date(answer), new Date());
  return result <= 90;
}
function Question7() {
  return ClosedQuestion.call(this, "CheckList.ClienProduceShares");
}
function Question8() {
  return ClosedQuestion.call(this, "Ownership.OwnershipStructureIsComplex");
}
function Question9() {
  return ClosedQuestion.call(this, "Ownership.OwnershipStructureIsComplex");
}
function Question10() {
  return ClosedQuestion.call(this, "Ownership.HasTrast");
}
function Question11() {
  const shoudInclude = "128";
  return OperationShoudinclude.call(this, shoudInclude);
}
function Question12() {
  const shoudInclude = "326";
  return OperationShoudinclude.call(this, shoudInclude);
}
//Вопрос 13 такой-же как и 12 заглушка для сохранение счета
function Question13() {
  return false;
}
function Question14() {
  const shoudInclude = "116";
  return OperationShoudinclude.call(this, shoudInclude);
}
function Question15() {
  return ClosedQuestion.call(
    this,
    "CheckList.HasInfoThatCompanyIsTaxFroudCompany"
  );
}
function Question16() {
  let resultArr = [];
  let director = this.result["Director"];
  if (!director || !director.length == 0) resultArr.push(false);
  else {
    let isFinaleOwner = director.filter((item) => item["IsFinaleOwner"])[0];
    if (isFinaleOwner) resultArr.push(true);
  }
  let owners = this.result["Owner"];
  if (!owners || !owners.length == 0) resultArr.push(false);
  else {
    let connectedPerson = owners.filter((item) => {
      return item["ConnectedPerson"]?.length != 0;
    })[0];
    if (connectedPerson) resultArr.push(true);

    let vulnerablePerson = owners.filter(
      (item) => item["IsVulnerablePerson"]
    )[0];
    if (vulnerablePerson) resultArr.push(true);
  }
  resultArr.push(ClosedQuestion.call(this, "CheckList.HasQuestionFromPolice"));
  resultArr.push(
    ClosedQuestion.call(this, "CheckList.HasInfoAboutEffectOnOwnerByRealOwners")
  );
  resultArr.push(
    ClosedQuestion.call(this, "CheckList.OwnerDontHavePlaneOfBuisness")
  );
  resultArr.push(
    ClosedQuestion.call(this, "CheckList.HasInfoAboutRestrictionOwnerRights")
  );
  resultArr.push(
    ClosedQuestion.call(this, "CheckList.CircleOfCommunicationDeefOfReality")
  );

  return resultArr.includes(true);
}

async function Question17() {
  let resultArr = [];
  /////////1/////////
  resultArr.push({
    1: ClosedQuestion.call(
      this,
      "CheckList.AdressOfRegistHasMassiveRegistCompany"
    ),
  });
  //////////2/////////
  let director = this.result["Director"];
  let owners = this.result["Owner"];

  let OfshoreCountry = await Helper.findOne({ name: "OfshoreCountry" });
  if (owners || owners.length != 0) {
    owners.forEach((item) => {
      let dirCountry = item["Regist"]?.Country;
      if (!dirCountry) return;
      resultArr.push({ 2.1: OfshoreCountry?.content.includes(dirCountry) });
    });
    //////////9///////////
    owners.forEach((item) => {
      resultArr.push({
        9.1: ClosedQuestion.call(
          { result: item },
          "HasFactOfChangeDirectorIfPEP"
        ),
      });
    });
  }
  if (director || director.length != 0) {
    director.forEach((item) => {
      let dirCountry = item["Regist"]?.Country;
      if (!dirCountry) return;
      resultArr.push({ 2.2: OfshoreCountry?.content.includes(dirCountry) });
    });
    //////////5///////////
    director.forEach((item) => {
      resultArr.push({
        5.1: ClosedQuestion.call({ result: item }, "IsVulnerablePeople"),
      });
      resultArr.push({
        5.2: ClosedQuestion.call({ result: item }, "IsPoorOrHomless"),
      });
      resultArr.push({
        5.3: ClosedQuestion.call({ result: item }, "IsTooYoungOrTooOld"),
      });
      resultArr.push({
        5.4: ClosedQuestion.call({ result: item }, "IsImmigrant"),
      });
    });
    //////////9///////////
    director.forEach((item) => {
      resultArr.push({
        9.2: ClosedQuestion.call(
          { result: item },
          "HasFactOfChangeDirectorIfPEP"
        ),
      });
    });
  }
  //////////3////////////
  let history = await diffHistory.getDiffs("CompanyFormData", this.id);
  if (history) {
    let formater = new Formater({});
    let companyHistory = history.map((item) => {
      return {
        diff: formater.format(item.diff),
      };
    });

    function personChanged(position, obj) {
      return obj.diff
        .map((item) => {
          if (
            item.path.split("/")[0] == position &&
            item.path.split("/").includes("INN") &&
            (item.op == OPERATIONS.add)
          ) {
            return true;
          }
          return false;
        })
        .includes(true);
    }
    let previousOwnersDirectors = [];
    companyHistory.forEach((item) => {
      previousOwnersDirectors.push(personChanged("Director", item));
      previousOwnersDirectors.push(personChanged("Owner", item));
    });
    if (
      previousOwnersDirectors.length != 0 &&
      previousOwnersDirectors.includes(true)
    ) {
      resultArr.push({ 3: true });
    }
  }
  //////////4///////////
  resultArr.push({
    4: ClosedQuestion.call(
      this,
      "CheckList.HasInfoThatCompanyRegistOnTheftDoc"
    ),
  });

  //////////6///////////
  resultArr.push({
    6: ClosedQuestion.call(
      this,
      "CheckList.RegistAdressInFlatWithAnotherCompany"
    ),
  });
  //////////7///////////
  resultArr.push({
    7: ClosedQuestion.call(this, "CheckList.HasInfoAboutFroudOwner"),
  });
  //////////8///////////
  resultArr.push({
    8: ClosedQuestion.call(this, "RegistPlace.AdressIsNotTrue"),
  });

  return resultArr.map((item) => Object.entries(item)[0][1]).includes(true);
}

function Question18() {
  let resultArr = [];
  //////////1///////////
  resultArr.push(
    ClosedQuestion.call(this, "CheckList.ClientDontHaveProductionCapacity")
  );
  //////////2///////////
  resultArr.push(
    ClosedQuestion.call(this, "CheckList.HasInfoAboutSendFroudInfoToGovFinDep")
  );
  //////////3///////////
  resultArr.push(ClosedQuestion.call(this, "CheckList.WorkersCountFalsy"));
  //////////4///////////
  resultArr.push(ClosedQuestion.call(this, "CheckList.CompanyPayByBarter"));
  //////////5///////////
  let income = this.result["MounthIncome"];
  if (
    (income && parthInt(income, 10) > 0) ||
    this.result["HasNegativeOperatingIncome"]
  ) {
    resultArr.push(true);
  }
  //////////6///////////
  resultArr.push(
    ClosedQuestion.call(this, "CheckList.HasNegativeOperatingIncome")
  );
  //////////7///////////
  resultArr.push(ClosedQuestion.call(this, "CheckList.HasMassiveLongCredit"));

  return resultArr.includes(true);
}

module.exports = {
  individual: [
    Question1,
    Question3,
    Question4,
    Question5,
    Question6,
    Question11,
    Question12,
    Question13,
    Question14,
  ],
  legalEntity: [
    Question1,
    Question2,
    Question3,
    Question4,
    Question5,
    Question6,
    Question7,
    Question8,
    Question9,
    Question10,
    Question11,
    Question12,
    Question13,
    Question14,
    Question15,
    Question16,
    Question17,
    Question18,
  ],
};
