const chai = require("chai");
const chaihttp = require("chai-http");
const chaiExclude = require("chai-exclude");
const TerroristService = require("../services/terrorist");
const PersonTerrorist = require("../models/personTerrorist");
const CompanyTerrorist = require("../models/companyTerrorist");


chai.should();
chai.use(chaihttp);
chai.use(chaiExclude);
module.exports = (server) => {
  describe("test terrorist update functions ", () => {
    before(async () => {
      await PersonTerrorist.deleteMany();
      await CompanyTerrorist.deleteMany();
    });
    it("update company terrorist from site", async () => {
      let service = new TerroristService();
      let flag = await service.updateFromSite();
      flag.should.be.true;
      let answer = await CompanyTerrorist.find();
      
      (answer.length > 0).should.be.true;
      let answer2 = await PersonTerrorist.find();
            (answer2.length > 0).should.be.true;
    });
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
   
      (answer.length > 0).should.be.true;
    });
    it("Cheak if company get from terrorist service by name", async () => {
      let searchtext = "AL-AKHTAR TRUST INTERNATIONAL";
      let service = new TerroristService();
      let answer = await service.searchCompany(searchtext);
  
      (answer.length > 0).should.be.true;
    });
  });
};
