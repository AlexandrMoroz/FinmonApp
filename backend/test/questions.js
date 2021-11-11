const chai = require("chai");
const chaihttp = require("chai-http");
const chaiExclude = require("chai-exclude");
const UnionOfFinRateQuestionGroup = require("../models/GroupOfQuestions/UnionOfFinRateQuestionGroup");
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
const { INDIVIDUALS, LEGALENTITES } =
  require("../models/GroupOfQuestions/groupOfQuestions").Types;
//const server = "http://localhost:4000";
const { testConfig } = require("../config/index");
const UnionOfReputationQuestions = require("../models/GroupOfQuestions/UnionOfReputationQuestions");
let server = require("../server")(testConfig);

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
  it("fin rate question classes for test func with only all negative person answers  ", async () => {
    let union = new UnionOfFinRateQuestionGroup(
      mockNegativePerson,
      INDIVIDUALS
    );
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
  it("fin rate question classes with only all negative person answers  ", async () => {
    let union = new UnionOfFinRateQuestionGroup(
      mockNegativePerson,
      INDIVIDUALS
    );
    let answers = await union.calcGroups();
    answers.should.equals("Високий");
  });
  it("fin rate question classes for test func with only all negative company answers  ", async () => {
    let union = new UnionOfFinRateQuestionGroup(
      newCompanyFormData,
      LEGALENTITES
    );
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
  it("fin rate question classes with only all negative company answers", async () => {
    let union = new UnionOfFinRateQuestionGroup(
      newCompanyFormData,
      LEGALENTITES
    );
    let answers = await union.calcGroups();
    answers.should.equals("Високий");
  });
  it("negative fin rate question classes with empty formdata", async () => {
    try {
      let union = new UnionOfFinRateQuestionGroup({}, LEGALENTITES);
      let answers = await union.calcGroups();
    } catch (err) {
      err.message.should.equals("FormData is empty");
    }
  });
  it("reputation question classes for test func with only all negative company answers", async () => {
    let union = new UnionOfReputationQuestions(newCompanyFormData);
    let answers = await union.calcGroupsForTest();
    let expect = [true, true, true];
    answers.forEach((item, i) => {
      item.should.equals(expect[i]);
    });
  });
  it("reputation question classes with only all negative company answers", async () => {
    let union = new UnionOfReputationQuestions(newCompanyFormData);
    let answers = await union.calcGroups();
    answers.should.equals("Негативна");
  });
  it("reputation question classes for test func with only all negative person answers", async () => {
    let union = new UnionOfReputationQuestions(mockNegativePerson);
    let answers = await union.calcGroupsForTest();
    let expect = [true, true, true];
    answers.forEach((item, i) => {
      item.should.equals(expect[i]);
    });
  });
  it("reputation question classes with only all negative company answers", async () => {
    let union = new UnionOfReputationQuestions(mockNegativePerson);
    let answers = await union.calcGroups();
    answers.should.equals("Негативна");
  });
  it("negative test reputation question classes with empty questions", async () => {
    try {
      let union = new UnionOfReputationQuestions({});
      let answers = await union.calcGroups();
    } catch (err) {
      err.message.should.equals("FormData is empty");
    }
  });
});
describe("test fin rate api", () => {
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
    let oldCompany = require("../mock/companyWithNegativeAnswers.json").result;
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
        res.body.result.flat().forEach((item, i, arr) => {
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
        res.body.result.flat().forEach((item, i, arr) => {
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
    let oldCompany = require("../mock/companyWithNegativeAnswers.json").result;
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
  it("it get Person reputation", (done) => {
    chai
      .request(server)
      .get("/api/person/reputation")
      .set("Authorization", token)
      .query({ id: newPerson.formDataResultId.toString() })
      .end((err, res) => {
        res.should.have.status(200);
        let expect = [true, true, true];
        res.body.result.flat().forEach((item, i, arr) => {
          item.should.equals(expect[i]);
        });
        done();
      });
  });
  it("it get Company reputation", (done) => {
    chai
      .request(server)
      .get("/api/company/reputation")
      .set("Authorization", token)
      .query({ id: newCompany.formDataResultId.toString() })
      .end((err, res) => {
        res.should.have.status(200);
        let expect = [true, true, true];
        res.body.result.flat().forEach((item, i, arr) => {
          item.should.equals(expect[i]);
        });
        done();
      });
  });
  it("it negative test get Person reputation without id", (done) => {
    chai
      .request(server)
      .get("/api/person/reputation")
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
  it("it negative test get Company reputation without id", (done) => {
    chai
      .request(server)
      .get("/api/company/reputation")
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
