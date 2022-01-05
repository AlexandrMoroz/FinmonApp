const chai = require("chai");
const chaihttp = require("chai-http");
const chaiExclude = require("chai-exclude");
const TerroristService = require("../services/terrorist");
const PersonTerrorist = require("../models/personTerrorist");
const CompanyTerrorist = require("../models/companyTerrorist");

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
  describe("test terrorist update functions ", () => {
    before(async () => {
      await PersonTerrorist.deleteMany();
      await CompanyTerrorist.deleteMany();
    });
    // it("update company terrorist from site", async () => {
    //   let service = new TerroristService();
    //   let flag = await service.updateTerroristFromSite();
    //   flag.should.be.true;
    //   let answer = await CompanyTerrorist.find();
    //   console.log(answer.length);
    //   (answer.length > 0).should.be.true;
    //   let answer2 = await PersonTerrorist.find();
    //   console.log(answer2.length);
    //   (answer2.length > 0).should.be.true;
    // });
  });
  describe("test terrorist search functions ", () => {
    before(async () => {
      await PersonTerrorist.deleteMany();
      await CompanyTerrorist.deleteMany();
      await PersonTerrorist.insertMany(
        require("../mock/personTerrorist.json").map((item) => {
          return { name: item.name };
        })
      );
      await CompanyTerrorist.insertMany(
        require("../mock/companyTerrorist.json").map((item) => {
          return { name: item.name };
        })
      );
    });
    it("Cheak if person get from terrorist service by name", async () => {
      let searchtext = "MOHAMMAD HAQQANI ";
      let service = new TerroristService();
      let answer = await service.searchPerson(searchtext);
      console.log(answer[0]);
      console.log(answer[1]);
      console.log(answer[2]);
      console.log(answer[3]);
      (answer.length > 0).should.be.true;
      
    });
    it("Cheak if company get from terrorist service by name", async () => {
      let searchtext = "AL-AKHTAR TRUST INTERNATIONAL";
      let service = new TerroristService();
      let answer = await service.searchCompany(searchtext);
     //console.log(answer);
      (answer.length > 0).should.be.true;
    });
  });
};
