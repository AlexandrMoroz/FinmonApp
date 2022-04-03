const chai = require("chai");
const chaihttp = require("chai-http");
const chaiExclude = require("chai-exclude");
const CalculatorRiskQuestions = require("../models/calculators/calculatorRiskQuestions");
const CalculatorReputationQuestions = require("../models/calculators/calculatorReputationQuestions");
const CalculatorFinansialRiskQuestions = require("../models/calculators/calculatorFinansialRiskQuestions");
const mockNegativePerson = require("../mock/personWIthNegativeAnswers.json");
const mockNegativeCompany = require("../mock/companyWithNegativeAnswers.json");
const helperService = require("../services/helper");
const personService = require("../services/person");
const userService = require("../services/user");
const companyService = require("../services/company");
const historyService = require("../services/history");
const ofshore = require("../mock/ofshoreCountry.json");
const translate = require("../mock/personTranslate.json");
const blackList = require("../mock/blackFATF.json");
const grayList = require("../mock/grayFATF.json");
const { PERSON, COMPANY } = require("../utils/helpers");

let token = "";
const user = require("../mock/adminUser.json");
chai.should();
chai.use(chaihttp);
chai.use(chaiExclude);
let newPerson;
let newCompany;
module.exports = (server) => {
  describe("test risk calculator", () => {
    before(async () => {
      await helperService.deleteAll();
      await helperService.create(ofshore.name, ofshore.result);
      await helperService.create(translate.name, translate.result);
      await helperService.create(blackList.name, blackList.result);
      await helperService.create(grayList.name, grayList.result);
      await companyService.deleteAll();
      await historyService.deleteAll();
      await personService.deleteAll();
      companyService.create(user.username, mockNegativeCompany.result);
      let editedCompany = {
        result: {
          Director: [
            {
              IsResident: true,
              Regist: { Country: "Камбоджа" },
              Live: { Country: "Ямайка" },
              IsSignificantParticipant: true,
              IsFinaleOwner: true,
              IsTerrorist: true,
              IsPEP: true,
              IsSanction: true,
              HasFactOfChangeDirectorIfPEP: true,
              IsVulnerablePeople: true,
              IsPoorOrHomless: true,
              IsTooYoungOrTooOld: true,
              IsImmigrant: true,
              Name: "Іванов",
              Family: "Іван",
              Surname: "Іванович",
              INN: "1234567891",
              Citizen: "Ямайка",
              ShareInCompany: "30",
              ConnectedPerson: [
                { NameOfCompany: 'ТОВ "ЮПІТЕР"', Position: "директор" },
                { NameOfCompany: 'ТОВ "ВЕНЕРА"', Position: "гол бухгалтер" },
                { NameOfCompany: 'ТОВ "МАРС"', Position: "директор" },
              ],
              DirectorRepresentative: [
                {
                  IsResident: true,
                  Regist: { Country: "Пакистан" },
                  Live: { Country: "Фiлiппiни" },
                  IsSignificantParticipant: true,
                  IsFinaleOwner: true,
                  IsTerrorist: true,
                  IsPEP: true,
                  IsSanction: true,
                  HasFactOfChangeDirectorIfPEP: true,
                  IsVulnerablePeople: true,
                  IsPoorOrHomless: true,
                  IsTooYoungOrTooOld: true,
                  IsImmigrant: true,
                  Name: "Гонец",
                  Family: "Микола",
                  Surname: "Азікович",
                  Citizen: "Марокко",
                },
              ],
            },
            {
              IsResident: true,
              Regist: { Country: "Іран" },
              Live: { Country: "Буркина-Фасо" },
              IsSignificantParticipant: true,
              IsFinaleOwner: true,
              IsTerrorist: true,
              IsPEP: true,
              IsSanction: true,
              HasFactOfChangeDirectorIfPEP: true,
              IsVulnerablePeople: true,
              IsPoorOrHomless: true,
              IsTooYoungOrTooOld: true,
              IsImmigrant: true,
              Name: "Іванов2",
              Family: "Іван2",
              Surname: "Іванович2",
              INN: "1234567894",
              Citizen: "Ямайка",
              ShareInCompany: "30",
              ConnectedPerson: [
                { NameOfCompany: 'ТОВ "ЮПІТЕР"', Position: "директор" },
                { NameOfCompany: 'ТОВ "ВЕНЕРА"', Position: "гол бухгалтер" },
                { NameOfCompany: 'ТОВ "МАРС"', Position: "директор" },
              ],
            },
          ],
        },
      };
      companyService.edit(user.username, editedCompany);
    });
    it("risk calculator for test func with only all negative person answers  ", async () => {
      let union = new CalculatorRiskQuestions(mockNegativePerson, PERSON);
      let answers = await union.calcGroupsForTest();
      let expect = [
        [true, true, true, true, false, true, true, true, true, true],
        [false, true, false],
        [true, true, true, true],
      ];
      expect = expect.flat();
      answers.flat().forEach((item, i, arr) => {
        item.should.equals(expect[i]);
      });
    });
    it("risk calculator with only all negative person answers  ", async () => {
      let union = new CalculatorRiskQuestions(mockNegativePerson, PERSON);
      let answers = await union.calcGroups();
      answers.should.equals("Високий (Винятковий список)");
    });
    it("risk calculator for test func with only all negative company answers  ", async () => {
      let union = new CalculatorRiskQuestions(mockNegativeCompany, COMPANY);
      let answers = await union.calcGroupsForTest();
      let expect = [
        [
          true,
          false,
          true,
          true,
          true,
          false,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
          true,
        ],
        [true, false, true, false],
        [true, true],
      ];
      expect = expect.flat();
      answers.flat().forEach((item, i, arr) => {
        item.should.equals(expect[i]);
      });
    });
    it("risk calculator with only all negative company answers", async () => {
      let union = new CalculatorRiskQuestions(mockNegativeCompany, COMPANY);
      let answers = await union.calcGroups();
      answers.should.equals("Неприйнятно високий (Винятковий список)");
    });
    it("negative risk calculator with empty formdata", async () => {
      try {
        let union = new CalculatorRiskQuestions({}, COMPANY);
        let answers = await union.calcGroups();
      } catch (err) {
        err.message.should.equals("FormData is empty");
      }
    });
  });
  describe("test reputation calculator", () => {
    it("reputation calculator for test func with only all negative company answers", async () => {
      let union = new CalculatorReputationQuestions(mockNegativeCompany);
      let answers = await union.calcGroupsForTest();
      let expect = [true, true, true];
      answers.forEach((item, i) => {
        item.should.equals(expect[i]);
      });
    });
    it("reputation calculator with only all negative company answers", async () => {
      let union = new CalculatorReputationQuestions(mockNegativeCompany);
      let answers = await union.calcGroups();
      answers.should.equals("Негативна");
    });
    it("reputation calculator for test func with only all negative person answers", async () => {
      let union = new CalculatorReputationQuestions(mockNegativePerson);
      let answers = await union.calcGroupsForTest();
      let expect = [true, true, true];
      answers.forEach((item, i) => {
        item.should.equals(expect[i]);
      });
    });
    it("reputation calculator with only all negative person answers", async () => {
      let union = new CalculatorReputationQuestions(mockNegativePerson);
      let answers = await union.calcGroups();
      answers.should.equals("Негативна");
    });
    it("negative test reputation calculator with empty questions", async () => {
      try {
        let union = new CalculatorReputationQuestions({});
        let answers = await union.calcGroups();
      } catch (err) {
        err.message.should.equals("FormData is empty");
      }
    });
  });
  describe("test finansial risk calculator", () => {
    it("finansial risk calculator for test func with company answers", async () => {
      let union = new CalculatorFinansialRiskQuestions(mockNegativeCompany);
      let answers = await union.calcGroupsForTest();
      let expect = [0.5, 0.75, 0.5, 0.5, 0.5, 1];
      answers.forEach((item, i) => {
        item.should.equals(expect[i]);
      });
    });
    it("finansial risk calculator with company answers", async () => {
      let union = new CalculatorFinansialRiskQuestions(mockNegativeCompany);
      let answers = await union.calcGroups();
      answers.should.equals("Незадовільно");
    });
    it("finansial risk calculator for test func with person answers", async () => {
      let union = new CalculatorFinansialRiskQuestions(mockNegativePerson);
      let answers = await union.calcGroupsForTest();
      let expect = [0.75, 0.5, 0.5, 0.5];
      answers.forEach((item, i) => {
        item.should.equals(expect[i]);
      });
    });
    it("finansial risk calculator with person answers", async () => {
      let union = new CalculatorFinansialRiskQuestions(mockNegativePerson);
      let answers = await union.calcGroups();
      answers.should.equals("Незадовільно");
    });
    it("finansial risk calculator for test func with person answers", async () => {
      let newMock = JSON.parse(JSON.stringify(mockNegativePerson));
      delete newMock.result.FOP;
      let union = new CalculatorFinansialRiskQuestions(newMock);
      let answers = await union.calcGroupsForTest();
      let expect = [1.75, 0.5, 0.25];
      answers.forEach((item, i) => {
        item.should.equals(expect[i]);
      });
    });
    it("finansial risk calculator with person answers", async () => {
      let newMock = JSON.parse(JSON.stringify(mockNegativePerson));
      delete newMock.result.FOP;
      let union = new CalculatorFinansialRiskQuestions(newMock);
      let answers = await union.calcGroups();
      answers.should.equals("Незадовільно");
    });

    it("negative test finansial risk calculator with empty questions", async () => {
      try {
        let union = new CalculatorFinansialRiskQuestions({});
        let answers = await union.calcGroups();
      } catch (err) {
        err.message.should.equals("FormData is empty");
      }
    });
  });
  describe("test risk api", () => {
    before(async () => {
      await userService.deleteAll();
      await userService.create(user);
      let res = await chai.request(server).post("/api/user/login").send({
        username: user.username,
        password: user.password,
      });
      token = res.body.token;
      await personService.deleteAll();
      await helperService.deleteAll();
      await helperService.create(ofshore.name, ofshore.result);
      await helperService.create(translate.name, translate.result);
      await helperService.create(blackList.name, blackList.result);
      await helperService.create(grayList.name, grayList.result);

      let oldPerson = require("../mock/personWIthNegativeAnswers.json");
      let oldCompany = require("../mock/companyWithNegativeAnswers.json");
      newPerson = await personService.create(user.username, oldPerson.result);
      newCompany = await companyService.create(
        user.username,
        oldCompany.result
      );
    });
    it("it get Person risk", async () => {
      let res = await chai
        .request(server)
        .get("/api/person/risk")
        .set("Authorization", token)
        .query({ id: newPerson.formDataResultId.toString() });

      res.should.have.status(200);
      res.body.result.should.equal("Високий (Винятковий список)");
    });
    it("it get Company risk", async () => {
      let res = await chai
        .request(server)
        .get("/api/company/risk")
        .set("Authorization", token)
        .query({ id: newCompany.formDataResultId.toString() });

      res.should.have.status(200);
      res.body.result.should.equal("Неприйнятно високий (Винятковий список)");
    });
    it("it negative test get company risk with wrong id", async () => {
      let res = await chai
        .request(server)
        .get("/api/company/risk")
        .set("Authorization", token)
        .query({ id: "123123124124123" });

      res.should.have.status(400);
      res.body.should.deep.equal({
        message: "Validation error",
        validation: false,
        success: false,
        error: [
          {
            value: "123123124124123",
            msg: "Невірний тип id",
            param: "id",
            location: "query",
          },
        ],
      });
    });
    it("it negative test get company risk without id", async () => {
      let res = await chai
        .request(server)
        .get("/api/company/risk")
        .set("Authorization", token)
        .query({ id: "" });

      res.should.have.status(400);
      res.body.should.deep.equal({
        message: "Validation error",
        validation: false,
        success: false,
        error: [
          {
            value: "",
            msg: "Невірний тип id",
            param: "id",
            location: "query",
          },
        ],
      });
    });
  });
  describe("test reputation api", () => {
    before(async () => {
      await userService.deleteAll();
      await userService.create(user);
      let res = await chai.request(server).post("/api/user/login").send({
        username: user.username,
        password: user.password,
      });
      token = res.body.token;
      await personService.deleteAll();
      await helperService.deleteAll();
      await helperService.create(ofshore.name, ofshore.result);
      await helperService.create(translate.name, translate.result);
      await helperService.create(blackList.name, blackList.result);
      await helperService.create(grayList.name, grayList.result);

      let oldPerson = require("../mock/personWIthNegativeAnswers.json");
      let oldCompany = require("../mock/companyWithNegativeAnswers.json");
      newPerson = await personService.create(user.username, oldPerson.result);
      newCompany = await companyService.create(
        user.username,
        oldCompany.result
      );
    });
    it("it get Person reputation", async () => {
      let res = await chai
        .request(server)
        .get("/api/person/reputation")
        .set("Authorization", token)
        .query({ id: newPerson.formDataResultId.toString() });
      res.should.have.status(200);
      res.body.result.should.equal("Негативна");
    });
    it("it get Company reputation", async () => {
      let res = await chai
        .request(server)
        .get("/api/company/reputation")
        .set("Authorization", token)
        .query({ id: newCompany.formDataResultId.toString() });
      res.should.have.status(200);
      res.body.result.should.equal("Негативна");
    });
    it("it negative test get Person reputation without id", async () => {
      let res = await chai
        .request(server)
        .get("/api/person/reputation")
        .set("Authorization", token)
        .query({ id: "" });
      res.should.have.status(400);
      res.body.should.deep.equal({
        message: "Validation error",
        validation: false,
        success: false,
        error: [
          {
            value: "",
            msg: "Невірний тип id",
            param: "id",
            location: "query",
          },
        ],
      });
    });
    it("it negative test get Company reputation without id", async () => {
      let res = await chai
        .request(server)
        .get("/api/company/reputation")
        .set("Authorization", token)
        .query({ id: "" });
      res.should.have.status(400);
      res.body.should.deep.equal({
        message: "Validation error",
        validation: false,
        success: false,
        error: [
          {
            value: "",
            msg: "Невірний тип id",
            param: "id",
            location: "query",
          },
        ],
      });
    });
  });
  describe("test finansial risk api", () => {
    before(async () => {
      await userService.deleteAll();
      await userService.create(user);
      let res = await chai.request(server).post("/api/user/login").send({
        username: user.username,
        password: user.password,
      });
      token = res.body.token;
      await personService.deleteAll();
      await helperService.deleteAll();
      await helperService.create(ofshore.name, ofshore.result);
      await helperService.create(translate.name, translate.result);
      await helperService.create(blackList.name, blackList.result);
      await helperService.create(grayList.name, grayList.result);

      let oldPerson = require("../mock/personWIthNegativeAnswers.json");
      let oldCompany = require("../mock/companyWithNegativeAnswers.json");
      newPerson = await personService.create(user.username, oldPerson.result);
      newCompany = await companyService.create(
        user.username,
        oldCompany.result
      );
    });
    it("it get Person finansial risk", async () => {
      let res = await chai
        .request(server)
        .get("/api/person/finansial-risk")
        .set("Authorization", token)
        .query({ id: newPerson.formDataResultId.toString() });
      res.should.have.status(200);

      res.body.result.should.equal("Незадовільно");
    });
    it("it get Company finansial risk", async () => {
      let res = await chai
        .request(server)
        .get("/api/company/finansial-risk")
        .set("Authorization", token)
        .query({ id: newCompany.formDataResultId.toString() });
      res.should.have.status(200);
      res.body.result.should.equal("Незадовільно");
    });
    it("it negative test get Person finansial risk without id", async () => {
      let res = await chai
        .request(server)
        .get("/api/person/finansial-risk")
        .set("Authorization", token)
        .query({ id: "" });
      res.should.have.status(400);
      res.body.should.deep.equal({
        message: "Validation error",
        validation: false,
        success: false,
        error: [
          {
            value: "",
            msg: "Невірний тип id",
            param: "id",
            location: "query",
          },
        ],
      });
    });
    it("it negative test get Company finansial risk without id", async () => {
      let res = await chai
        .request(server)
        .get("/api/company/finansial-risk")
        .set("Authorization", token)
        .query({ id: "" });
      res.should.have.status(400);
      res.body.should.deep.equal({
        message: "Validation error",
        validation: false,
        success: false,
        error: [
          {
            value: "",
            msg: "Невірний тип id",
            param: "id",
            location: "query",
          },
        ],
      });
    });
  });
};
