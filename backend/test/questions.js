const chai = require("chai");
const chaihttp = require("chai-http");
const chaiExclude = require("chai-exclude");
const CalculatorRiskQuestions = require("../models/Unions/CalculatorRiskQuestions");
const CalculatorReputationQuestions = require("../models/Unions/CalculatorReputationQuestions");
const CalculatorFinansialRiskQuestions = require("../models/Unions/CalculatorFinansialRiskQuestions");
const mockNegativePerson = require("../mock/personWIthNegativeAnswers.json");
const mockNegativeCompany = require("../mock/companyWithNegativeAnswers.json");
const Helper = require("../models/helper");
const PersonFormData = require("../models/personFormData");
const Person = require("../models/person");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const CompanyFormData = require("../models/companyFormData");
const Company = require("../models/company");
const History = require("mongoose-diff-history/diffHistoryModel").model;
const { INDIVIDUALS, LEGALENTITES, PERSON } =
  require("../models/Unions/groupOfQuestions").Types;

let token = "";
const user = {
  block: false,
  role: "admin",
  name: "alexandr1",
  family: "moroz1",
  surname: "sergeevich1",
  cashboxAdress:
    "68000, Одеська обл., м. Чорноморськ, проспект Миру, буд. 29-п/1",
  email: "alexandr@gmail.com",
  username: "alexandrMorozzz12",
  password: "123qwe123qwe",
};
chai.should();
chai.use(chaihttp);
chai.use(chaiExclude);
let newPerson;
let newCompany;
module.exports = (server) => {
  describe("test risk calculator", () => {
    before(async () => {
      await Helper.deleteMany({});
      let ofshore = require("../mock/ofshoreCountry.json");
      await new Helper({ name: ofshore.name, content: ofshore.content }).save();
      let translate = require("../mock/personTranslate.json");
      await new Helper({
        name: translate.name,
        content: translate.content,
      }).save();
      await CompanyFormData.deleteMany({});
      await Company.deleteMany({});
      await History.deleteMany({});
      oldCompany = mockNegativeCompany;
      newCompanyFormData = await new CompanyFormData({
        result: oldCompany.result,
      }).save();
      newCompany = await new Company({
        shortName: oldCompany.result.ShortName,
        clientCode: oldCompany.result.ClientCode,
        username: user.username,
        formDataResultId: newCompanyFormData._id,
      }).save();
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
      await CompanyFormData.findOneAndUpdate(
        { _id: newCompany.formDataResultId },
        { result: editedCompany.result },
        {
          new: true,
          __user: `${user.username}`,
          __reason: `${user.username} updated`,
        }
      );
      await Company.findOneAndUpdate(
        { _id: newCompany._id.toString() },
        {
          shortName: oldCompany.result.ShortName,
          clientCode: oldCompany.result.ClientCode.toString(),
        },
        (err, doc, res, next) => {
          if (err) {
            throw err;
          }
        }
      );
    });
    it("risk calculator for test func with only all negative person answers  ", async () => {
      let union = new CalculatorRiskQuestions(mockNegativePerson, INDIVIDUALS);
      let answers = await union.calcGroupsForTest();
      const expect = [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        true,
        true,
        true,
      ];
      answers.flat().forEach((item, i, arr) => {
        item.should.equals(expect[i]);
      });
    });
    it("risk calculator with only all negative person answers  ", async () => {
      let union = new CalculatorRiskQuestions(mockNegativePerson, INDIVIDUALS);
      let answers = await union.calcGroups();
      answers.should.equals("Високий");
    });
    it("risk calculator for test func with only all negative company answers  ", async () => {
      let union = new CalculatorRiskQuestions(newCompanyFormData, LEGALENTITES);
      let answers = await union.calcGroupsForTest();
      const expect = [
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
        false,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        false,
        true,
        true,
      ];
      answers.flat().forEach((item, i, arr) => {
        item.should.equals(expect[i]);
      });
    });
    it("risk calculator with only all negative company answers", async () => {
      let union = new CalculatorRiskQuestions(newCompanyFormData, LEGALENTITES);
      let answers = await union.calcGroups();
      answers.should.equals("Високий");
    });
    it("negative risk calculator with empty formdata", async () => {
      try {
        let union = new CalculatorRiskQuestions({}, LEGALENTITES);
        let answers = await union.calcGroups();
      } catch (err) {
        err.message.should.equals("FormData is empty");
      }
    });
  });
  describe("test reputation calculator", () => {
    it("reputation calculator for test func with only all negative company answers", async () => {
      let union = new CalculatorReputationQuestions(newCompanyFormData);
      let answers = await union.calcGroupsForTest();
      let expect = [true, true, true];
      answers.forEach((item, i) => {
        item.should.equals(expect[i]);
      });
    });
    it("reputation calculator with only all negative company answers", async () => {
      let union = new CalculatorReputationQuestions(newCompanyFormData);
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
      let union = new CalculatorFinansialRiskQuestions(newCompanyFormData);
      let answers = await union.calcGroupsForTest();
      let expect = [0.5, 0.75, 1, 0.5, 0.5, 1];
      answers.forEach((item, i) => {
        item.should.equals(expect[i]);
      });
    });
    it("finansial risk calculator with company answers", async () => {
      let union = new CalculatorFinansialRiskQuestions(newCompanyFormData);
      let answers = await union.calcGroups();
      answers.should.equals("Незадовільно");
    });
    it("finansial risk calculator for test func with individual answers", async () => {
      let union = new CalculatorFinansialRiskQuestions(mockNegativePerson);
      let answers = await union.calcGroupsForTest();
      let expect = [0.75, 0.5, 1, 0.5];
      answers.forEach((item, i) => {
        item.should.equals(expect[i]);
      });
    });
    it("finansial risk calculator with  individual answers", async () => {
      let union = new CalculatorFinansialRiskQuestions(mockNegativePerson);
      let answers = await union.calcGroups();
      answers.should.equals("Незадовільно");
    });
    it("finansial risk calculator for test func with  person answers", async () => {
      let newMock = JSON.parse(JSON.stringify(mockNegativePerson));
      delete newMock.result["FOP"];
      let union = new CalculatorFinansialRiskQuestions(newMock);
      let answers = await union.calcGroupsForTest();
      let expect = [1.75, 1, 0.25];
      answers.forEach((item, i) => {
        item.should.equals(expect[i]);
      });
    });
    it("finansial risk calculator with person answers", async () => {
      let newMock = JSON.parse(JSON.stringify(mockNegativePerson));
      delete newMock.result["FOP"];
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
      await User.deleteMany({});
      let password = await bcrypt.hash(user.password, 12);
      newuser = await new User({ ...user, password }).save();

      try {
        let res = await chai.request(server).post("/api/user/login").send({
          username: user.username,
          password: user.password,
        });
        res.status;
        token = res.body.token;

        await PersonFormData.deleteMany({});
        await Person.deleteMany({});
        await Helper.deleteMany({});
        let ofshore = require("../mock/ofshoreCountry.json");
        await new Helper({
          name: ofshore.name,
          content: ofshore.content,
        }).save();
        let translate = require("../mock/personTranslate.json");
        await new Helper({
          name: translate.name,
          content: translate.content,
        }).save();
        let oldPerson =
          require("../mock/personWIthNegativeAnswers.json").result;

        let newPersonFormData = await new PersonFormData({
          result: oldPerson,
        }).save();
        newPerson = await new Person({
          name: oldPerson.Name,
          family: oldPerson.Family,
          surname: oldPerson.Surname,
          INN: oldPerson.INN,
          username: user.username,
          formDataResultId: newPersonFormData._id,
        }).save();
        let oldCompany =
          require("../mock/companyWithNegativeAnswers.json").result;
        await CompanyFormData.deleteMany({});
        await Company.deleteMany({});
        let newCompanyFormData = await new CompanyFormData({
          result: oldCompany,
        }).save();
        newCompany = await new Company({
          shortName: oldCompany.ShortName,
          clientCode: oldCompany.ClientCode,
          username: user.username,
          formDataResultId: newCompanyFormData._id,
        }).save();
      } catch (err) {
        console.log(err);
      }
    });
    it("it get Person risk", async () => {
      let res = await chai
        .request(server)
        .get("/api/person/risk")
        .set("Authorization", token)
        .query({ id: newPerson.formDataResultId.toString() });
      console.log(res.body);
      const expect = [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        true,
        true,
        true,
      ];
      res.should.have.status(200);
      res.body.result.flat().forEach((item, i, arr) => {
        item.should.equals(expect[i]);
      });
    });
    it("it get Company risk", async () => {
      let res  = await chai
        .request(server)
        .get("/api/company/risk")
        .set("Authorization", token)
        .query({ id: newCompany.formDataResultId.toString() });

      res.should.have.status(200);
      const expect = [
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
        false,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        false,
        true,
        true,
      ];
      res.body.result.flat().forEach((item, i, arr) => {
        item.should.equals(expect[i]);
      });
    });
    it("it negative test get company risk with wrong id", async () => {
      let res  = await chai
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
      let res  = await chai
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
      await User.deleteMany({});
      let password = await bcrypt.hash(user.password, 12);
      newuser = await new User({ ...user, password }).save();
      try {
        let res = await chai.request(server).post("/api/user/login").send({
          username: user.username,
          password: user.password,
        });
        res.status;
        token = res.body.token;
      } catch (err) {
        err; //?
      }
      await PersonFormData.deleteMany({});
      await Person.deleteMany({});
      await Helper.deleteMany({});
      let ofshore = require("../mock/ofshoreCountry.json");
      await new Helper({ name: ofshore.name, content: ofshore.content }).save();
      let translate = require("../mock/personTranslate.json");
      await new Helper({
        name: translate.name,
        content: translate.content,
      }).save();
      let oldPerson = require("../mock/personWIthNegativeAnswers.json").result;
      let newPersonFormData = await new PersonFormData({
        result: oldPerson,
      }).save();
      newPerson = await new Person({
        name: oldPerson.Name,
        family: oldPerson.Family,
        surname: oldPerson.Surname,
        INN: oldPerson.INN,
        username: user.username,
        formDataResultId: newPersonFormData._id,
      }).save();
      let oldCompany =
        require("../mock/companyWithNegativeAnswers.json").result;
      await CompanyFormData.deleteMany({});
      await Company.deleteMany({});
      let newCompanyFormData = await new CompanyFormData({
        result: oldCompany,
      }).save();
      newCompany = await new Company({
        shortName: oldCompany.ShortName,
        clientCode: oldCompany.ClientCode,
        username: user.username,
        formDataResultId: newCompanyFormData._id,
      }).save();
    });
    it("it get Person reputation", async () => {
      let res  = await chai
        .request(server)
        .get("/api/person/reputation")
        .set("Authorization", token)
        .query({ id: newPerson.formDataResultId.toString() });
      res.should.have.status(200);
      let expect = [true, true, true];
      res.body.result.flat().forEach((item, i, arr) => {
        item.should.equals(expect[i]);
      });
    });
    it("it get Company reputation", async () => {
      let res  = await chai
        .request(server)
        .get("/api/company/reputation")
        .set("Authorization", token)
        .query({ id: newCompany.formDataResultId.toString() });
      res.should.have.status(200);
      let expect = [true, true, true];
      res.body.result.flat().forEach((item, i, arr) => {
        item.should.equals(expect[i]);
      });
    });
    it("it negative test get Person reputation without id", async () => {
      let res  = await chai
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
      let res  = await chai
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
      await User.deleteMany({});
      let password = await bcrypt.hash(user.password, 12);
      newuser = await new User({ ...user, password }).save();
      try {
        let res = await chai.request(server).post("/api/user/login").send({
          username: user.username,
          password: user.password,
        });
        res.status;
        token = res.body.token;
      } catch (err) {
        err; //?
      }
      await PersonFormData.deleteMany({});
      await Person.deleteMany({});
      await Helper.deleteMany({});
      let ofshore = require("../mock/ofshoreCountry.json");
      await new Helper({ name: ofshore.name, content: ofshore.content }).save();
      let translate = require("../mock/personTranslate.json");
      await new Helper({
        name: translate.name,
        content: translate.content,
      }).save();
      let oldPerson = require("../mock/personWIthNegativeAnswers.json").result;
      let newPersonFormData = await new PersonFormData({
        result: oldPerson,
      }).save();
      newPerson = await new Person({
        name: oldPerson.Name,
        family: oldPerson.Family,
        surname: oldPerson.Surname,
        INN: oldPerson.INN,
        username: user.username,
        formDataResultId: newPersonFormData._id,
      }).save();
      let oldCompany =
        require("../mock/companyWithNegativeAnswers.json").result;
      await CompanyFormData.deleteMany({});
      await Company.deleteMany({});
      let newCompanyFormData = await new CompanyFormData({
        result: oldCompany,
      }).save();
      newCompany = await new Company({
        shortName: oldCompany.ShortName,
        clientCode: oldCompany.ClientCode,
        username: user.username,
        formDataResultId: newCompanyFormData._id,
      }).save();
    });
    it("it get Person finansial risk", async () => {
      let res  = await chai
        .request(server)
        .get("/api/person/finansial-risk")
        .set("Authorization", token)
        .query({ id: newPerson.formDataResultId.toString() });
      res.should.have.status(200);
      let expect = [0.75, 0.5, 1, 0.5];
      res.body.result.flat().forEach((item, i, arr) => {
        item.should.equals(expect[i]);
      });
    });
    it("it get Company finansial risk", async () => {
      let res  = await chai
        .request(server)
        .get("/api/company/finansial-risk")
        .set("Authorization", token)
        .query({ id: newCompany.formDataResultId.toString() });
      res.should.have.status(200);
      let expect = [0.5, 0.75, 1, 0.5, 0.5, 1];
      res.body.result.flat().forEach((item, i, arr) => {
        item.should.equals(expect[i]);
      });
    });
    it("it negative test get Person finansial risk without id", async () => {
      let res  = await chai
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
      let res  = await chai
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
