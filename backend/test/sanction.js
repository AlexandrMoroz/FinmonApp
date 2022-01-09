const chai = require("chai");
const chaihttp = require("chai-http");
const chaiExclude = require("chai-exclude");
const SanctionService = require("../services/sanction");
const CompanySanction = require("../models/companySanction");
const PersonSanction = require("../models/personSanction");

// const User = require("../models/user");
// let token = "";
// const user = {
//   block: false,
//   role: "admin",
//   name: "alexandr1",
//   family: "moroz1",
//   surname: "sergeevich1",
//   cashboxAdress:
//     "68000, Одеська обл., м. Чорноморськ, проспект Миру, буд. 29-п/1",
//   email: "alexandr@gmail.com",
//   username: "alexandrMorozzz12",
//   password: "123qwe123qwe",
// };
chai.should();
chai.use(chaihttp);
chai.use(chaiExclude);
module.exports = (server) => {
  describe("test sanction update functions ", () => {
    before(async () => {
      await PersonSanction.deleteMany();
      await CompanySanction.deleteMany();
    });
    it("update company sactions from site", async () => {
      let service = new SanctionService();
      let flag = await service.updateCompanyFromSite();
      flag.should.equal(true);
      let answer = await CompanySanction.find();
      console.log(answer.length);
      (answer.length > 0).should.be.true;
    });
    it("update person sactions from site", async () => {
      let service = new SanctionService();
      let flag = await service.updatePersonFromSite();
      flag.should.equal(true);
      let answer = await PersonSanction.find();
      let min = 20;
      answer.forEach((item) => {
        if (item.name_ukr.length < min) {
          min = item.name_ukr.length;
        }
      });
      (answer.length > 0).should.be.true;
    });
    it("update sactions from site", async () => {
      let service = new SanctionService();
      let flag = await service.updateFromSite();
      flag.should.equal(true);
      let answer = await PersonSanction.find();
      let answer2 = await CompanySanction.find();
      (answer.length > 0).should.be.true;
      (answer2.length > 0).should.be.true;
    });
  });
  // describe("test sanction search functions ", () => {
  //   before(async () => {
  //     let person = await PersonSanction.findOne();
  //     if (!person) {
  //       await PersonSanction.insertMany(require("../mock/personSanction.json"));
  //     }
  //     let company = await CompanySanction.findOne();
  //     if (!company) {
  //       let mock = require("../mock/companySanction.json");
  //       await CompanySanction.insertMany(
  //         mock.map((item) => {
  //           let odrn_edrpou = item.odrn_edrpou
  //             ? item.odrn_edrpou.replace("ОДРН", "")
  //             : null;
  //           let ipn = item.ipn ? item.ipn.replace("ІПН", "") : null;
  //           return { ...item, odrn_edrpou, ipn };
  //         })
  //       );
  //     }
  //   });
  //   it("Cheak if person get from sanction service by name", async () => {
  //     let searchtext = "Мар’янович";
  //     await cheakPersonAnswer(searchtext);
  //   });
  //   it("Cheak if person get from sanction service by birthdate", async () => {
  //     let searchtext = "19651228";
  //     await cheakPersonAnswer(searchtext);
  //   });
  //   it("Cheak if company get from sanction service by name", async () => {
  //     let searchtext = "Іркут";
  //     await cheakCompanyAnswer(searchtext);
  //   });
  //   it("Cheak if company get from sanction service by inp", async () => {
  //     let searchtext = "3811161639";
  //     await cheakCompanyAnswer(searchtext);
  //   });
  //   it("Cheak if company get from sanction service by odrn_edrpou", async () => {
  //     let searchtext = "1123850044372";
  //     await cheakCompanyAnswer(searchtext);
  //   });
  //   it("Cheak if company get from sanction service by name_original", async () => {
  //     let searchtext = " Иркут ";
  //     await cheakCompanyAnswer(searchtext);
  //   });
  // });
};

async function cheakCompanyAnswer(searchtext) {
  let service = new SanctionService();
  let search_answer = await service.searchCompany(searchtext);
  (search_answer.length > 0).should.be.true;
  search_answer[0].name_ukr.should.equal('ТОВ "Іркут"');
  search_answer[0].name_original.should.equal(
    'Общество с ограниченной ответственностью "Иркут"'
  );
  search_answer[0].odrn_edrpou.should.equal("1123850044372");
  search_answer[0].ipn.should.equal("3811161639");
}
async function cheakPersonAnswer(searchtext) {
  let service = new SanctionService();
  let search_answer = await service.searchPerson(searchtext);
  console.log(search_answer);
  (search_answer.length > 0).should.be.true;
  search_answer[0].name_ukr.should.equal("Мар’янович Велимир");
  search_answer[0].name_original.should.equal("Maryanovich Velimir");
  search_answer[0].birthdate.should.equal("1965-12-28");
}
