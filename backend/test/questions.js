const chai = require("chai");
const chaihttp = require("chai-http");
const chaiExclude = require("chai-exclude");
const UnionOfQuestionGroup = require("../models/GroupOfQuestions/unionOfQuestionGroup");
const mockNegativePerson = require("../mock/personWithNegativeAnswers");
const mockNegativeCompany = require("../mock/companyWithNegativeAnswers");
const Helper = require("../models/helper");
const PersonFormData = require("../models/personFormData");
const Person = require("../models/person");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const CompanyFormData = require("../models/companyFormData");
const Company = require("../models/company");
const { INDIVIDUALS, LEGALENTITES } =
  require("../models/GroupOfQuestions/groupOfQuestions").Types;
const server = "http://localhost:4000";
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
let test = () => {
  describe("test fin rate question classes", () => {
    before(async () => {
      await Helper.deleteMany({});
      let ofshore = require("../mock/ofshoreCountry.json");
      await new Helper({ name: ofshore.name, content: ofshore.content }).save();
      let translate = require("../mock/personTranslate.json");
      await new Helper({
        name: translate.name,
        content: translate.content,
      }).save();
    });
    it("question classes with only all negative person answers  ", async () => {
      let union = new UnionOfQuestionGroup(mockNegativePerson, INDIVIDUALS);
      let answers = await union.calcGroups();
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
      answers.forEach((item, i, arr) => {
        item.should.equals(expect[i]);
      });
    });

    it("question classes with only all negative company answers  ", async () => {
      let union = new UnionOfQuestionGroup(mockNegativeCompany, LEGALENTITES);
      let answers = await union.calcGroups();
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
      answers.forEach((item, i, arr) => {
        item.should.equals(expect[i]);
      });
    });
  });
  describe("test fin rate api", () => {
    before(async () => {
      await User.deleteMany({});
      let password = await bcrypt.hash(user.password, 12);
      newuser = await new User({ ...user, password }).save();
      let res = await chai.request(server).post("/api/user/login").send({
        username: user.username,
        password: user.password,
      });
      token = res.body.token;

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
    it("it get Person fin rate", (done) => {
      chai
        .request(server)
        .get("/api/person/finrate")
        .set("Authorization", token)
        .query({ id: newPerson.formDataResultId.toString() })
        .end((err, res) => {
          res.should.have.status(200);
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
          res.body.result.forEach((item, i, arr) => {
            item.should.equals(expect[i]);
          });
          done();
        });
    });
    it("it get Company fin rate", (done) => {
      chai
        .request(server)
        .get("/api/company/finrate")
        .set("Authorization", token)
        .query({ id: newCompany.formDataResultId.toString() })
        .end((err, res) => {
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
          res.body.result.forEach((item, i, arr) => {
            item.should.equals(expect[i]);
          });

          done();
        });
    });
    it("it negative test get company fin rate with wrong id", (done) => {
      chai
        .request(server)
        .get("/api/company/finrate")
        .set("Authorization", token)
        .query({ id: "123123124124123" })
        .end((err, res) => {
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
          done();
        });
    });
    it("it negative test get company fin rate without id", (done) => {
      chai
        .request(server)
        .get("/api/company/finrate")
        .set("Authorization", token)
        .query({ id: "" })
        .end((err, res) => {
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
          done();
        });
    });
  });
};
module.exports = test;
