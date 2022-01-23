const chai = require("chai");
const chaihttp = require("chai-http");
const chaiExclude = require("chai-exclude");
chai.config.includeStack = true;
const XLSX = require("xlsx");
const Person = require("../models/person");
const PersonFormData = require("../models/personFormData");
const Company = require("../models/company");
const CompanyFormData = require("../models/companyFormData");
const History = require("mongoose-diff-history/diffHistoryModel").model;
const Helper= require("../models/helper");
// const server = "http://localhost:4000";
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
let init = async (server, oldResult, editResult, url) => {
  let newResult = (
    await chai
      .request(server)
      .post("/api/" + url + "/create")
      .set("Authorization", token)
      .send(oldResult)
  ).body.result;
  editResult = {
    ...editResult,
    formDataResultId: newResult.formDataResultId.toString(),
    _id: newResult._id.toString(),
  };
  await chai
    .request(server)
    .put("/api/" + url + "/edit")
    .set("Authorization", token)
    .send(editResult);
  return newResult;
};

let test = (server) => {
  describe("test History api", () => {
    before((done) => {
      chai
        .request(server)
        .post("/api/user/login")
        .send({
          username: user.username,
          password: user.password,
        })
        .end((err, res) => {
          token = res.body.token;
          done();
        });
    });
    describe("History/getPersonJSONHistory ", () => {
      let newPerson;
      let oldPerson;
      before(async () => {
        await PersonFormData.deleteMany({});
        await Person.deleteMany({});
        await History.deleteMany({});
        oldPerson = {
          result: {
            Name: "Alexandr",
            Family: "Moroz",
            Surname: "Sergeevich",
            INN: "2312234312",
            IsResident: false,
          },
        };
        let editResult = {
          result: {
            Name: "Alexandr2",
            Family: "Moroz2",
            Surname: "Sergeevich2",
            DateOfFirstSigned: "12.12.2021",
            INN: "2312234312",
            IsResident: false,
          },
        };
        newPerson = await init(server, oldPerson, editResult, "person");
        let translate = require("../mock/personTranslate.json");
        await new Helper({name:translate.name,result:translate.result}).save()
      });

      it("it get Person json History", (done) => {
        const HistoryCred = {
          id: newPerson.formDataResultId.toString(),
        };
        chai
          .request(server)
          .get("/api/history/person-history")
          .set("Authorization", token)
          .query(HistoryCred)
          .end((err, res) => {
            res.body.result[0].diff.should.deep.equal([
              {
                op: "Додано",
                path: "Дата первинного заповнення анкети",
                value: "12.12.2021",
              },
              {
                op: "Замінено",
                path: "Прізвище",
                was: "Moroz",
                became: "Moroz2",
              },
              {
                op: "Замінено",
                path: "Ім'я",
                was: "Alexandr",
                became: "Alexandr2",
              },
              {
                op: "Замінено",
                path: "По батькові",
                was: "Sergeevich",
                became: "Sergeevich2",
              },
            ]);
            res.should.have.status(200);
            done();
          });
      });
      it("it get Person json History with auth err ", (done) => {
        const HistoryCred = {
          id: newPerson.formDataResultId.toString(),
        };
        chai
          .request(server)
          .get("/api/history/person-history")
          .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
          .query(HistoryCred)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });
      it("it negative test send get Person json History with not exists id property suspect validation err ", (done) => {
        const HistoryCred = {
          id: "10adf77dfb53d91e28576c74",
        };
        chai
          .request(server)
          .get("/api/history/person-history")
          .set("Authorization", token)
          .query(HistoryCred)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("message").eql("Validation error");
            res.body.should.have.property("validation").eql(false);
            res.body.should.deep.equal({
              message: "Validation error",
              validation: false,
              success: false,
              error: [
                {
                  value: "10adf77dfb53d91e28576c74",
                  msg: "Неверный id",
                  param: "id",
                  location: "query",
                },
              ],
            });
            done();
          });
      });
      it("it negative test send create new helper with null result suspesct validation err ", (done) => {
        const HistoryCred = {};
        chai
          .request(server)
          .get("/api/history/person-history")
          .set("Authorization", token)
          .query(HistoryCred)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("message").eql("Validation error");
            res.body.should.have.property("validation").eql(false);
            res.body.should.deep.equal({
              message: "Validation error",
              validation: false,
              success: false,
              error: [
                {
                  msg: "Поле id пустое",
                  param: "id",
                  location: "query",
                },
              ],
            });
            done();
          });
      });
    });

    describe("History/getPersonHistoryFile ", () => {
      let newPerson;
      let oldPerson;
      before(async () => {
        await PersonFormData.deleteMany({});
        await Person.deleteMany({});
        await History.deleteMany({});
        oldPerson = {
          result: {
            Name: "Alexandr",
            Family: "Moroz",
            Surname: "Sergeevich",
            INN: "2312234312",
            IsResident: false,
          },
        };
        let editResult = {
          result: {
            Name: "Alexandr2",
            Family: "Moroz2",
            Surname: "Sergeevich2",
            DateOfFirstSigned: "12.12.2021",
            INN: "2312234312",
            IsResident: false,
          },
        };
        newPerson = await init(server, oldPerson, editResult, "person");
      });

      it("it get person history file", (done) => {
        chai
          .request(server)
          .get("/api/history/person-history-file")
          .set("Authorization", token)
          .query({ id: newPerson.formDataResultId.toString(),})
          .end((err, res) => {
            const wb = XLSX.read(res.body.result, { type: "base64" });
            let obj = {
              Історія: {
                "!ref": "A1:D8",
                A1: {
                  t: "s",
                  v: "Користувач: ",
                  h: "Користувач: ",
                  w: "Користувач: ",
                },
                B1: {
                  t: "s",
                  v: "alexandr2 moroz1 sergeevich1",
                  h: "alexandr2 moroz1 sergeevich1",
                  w: "alexandr2 moroz1 sergeevich1",
                },
                C1: {
                  t: "s",
                  v: "Дата створенно",
                  h: "Дата створенно",
                  w: "Дата створенно",
                },
                A2: { t: "s", v: "Додано", h: "Додано", w: "Додано" },
                B2: {
                  t: "s",
                  v: "Дата первинного заповнення анкети",
                  h: "Дата первинного заповнення анкети",
                  w: "Дата первинного заповнення анкети",
                },
                C2: {
                  t: "s",
                  v: "12.12.2021",
                  h: "12.12.2021",
                  w: "12.12.2021",
                },
                A3: { t: "s", v: "Замінено", h: "Замінено", w: "Замінено" },
                B3: { t: "s", v: "Прізвище", h: "Прізвище", w: "Прізвище" },
                C3: { t: "s", v: "was", h: "was", w: "was" },
                D3: { t: "s", v: "Moroz", h: "Moroz", w: "Moroz" },
                C4: { t: "s", v: "became", h: "became", w: "became" },
                D4: { t: "s", v: "Moroz2", h: "Moroz2", w: "Moroz2" },
                A5: { t: "s", v: "Замінено", h: "Замінено", w: "Замінено" },
                B5: { t: "s", v: "Ім'я", h: "Ім&apos;я", w: "Ім'я" },
                C5: { t: "s", v: "was", h: "was", w: "was" },
                D5: { t: "s", v: "Alexandr", h: "Alexandr", w: "Alexandr" },
                C6: { t: "s", v: "became", h: "became", w: "became" },
                D6: { t: "s", v: "Alexandr2", h: "Alexandr2", w: "Alexandr2" },
                A7: { t: "s", v: "Замінено", h: "Замінено", w: "Замінено" },
                B7: {
                  t: "s",
                  v: "По батькові",
                  h: "По батькові",
                  w: "По батькові",
                },
                C7: { t: "s", v: "was", h: "was", w: "was" },
                D7: {
                  t: "s",
                  v: "Sergeevich",
                  h: "Sergeevich",
                  w: "Sergeevich",
                },
                C8: { t: "s", v: "became", h: "became", w: "became" },
                D8: {
                  t: "s",
                  v: "Sergeevich2",
                  h: "Sergeevich2",
                  w: "Sergeevich2",
                },
              },
            };
            wb.Sheets["Історія"].should
              .excluding(["D1"])
              .deep.equal(obj["Історія"]);
            res.should.have.status(200);
            done();
          });
      });
      it("it get Person history file with auth err ", (done) => {
        const HistoryCred = {
          id: newPerson._id.toString(),
        };
        chai
          .request(server)
          .get("/api/history/person-history-file")
          .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
          .query(HistoryCred)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });
      it("it negative test send get Person history file with not exists id property suspect validation err ", (done) => {
        const HistoryCred = {
          id: "10adf77dfb53d91e28576c74", //not exists id
        };
        chai
          .request(server)
          .get("/api/history/person-history-file")
          .set("Authorization", token)
          .query(HistoryCred)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("message").eql("Validation error");
            res.body.should.have.property("validation").eql(false);
            res.body.should.deep.equal({
              message: "Validation error",
              validation: false,
              success: false,
              error: [
                {
                  value: "10adf77dfb53d91e28576c74",
                  msg: "Неверный id",
                  param: "id",
                  location: "query",
                },
              ],
            });
            done();
          });
      });
      it("it negative test send get Person history file with null result suspesct validation err ", (done) => {
        const HistoryCred = {};
        chai
          .request(server)
          .get("/api/history/person-history-file")
          .set("Authorization", token)
          .query(HistoryCred)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("message").eql("Validation error");
            res.body.should.have.property("validation").eql(false);
            res.body.should.deep.equal({
              message: "Validation error",
              validation: false,
              success: false,
              error: [
                {
                  msg: "Поле id пустое",
                  param: "id",
                  location: "query",
                },
              ],
            });
            done();
          });
      });
    });

    describe("History/getCompanyJSONHistory ", () => {
      let newCompany;
      let oldCompany;

      before(async () => {
        await CompanyFormData.deleteMany({});
        await Company.deleteMany({});
        await History.deleteMany({});
        oldCompany = {
          result: {
            ShortName: "ТОВ ФИНОД",
            ClientCode: "12321141",
            IsResident: false,
          },
        };
        editResult = {
          result: {
            ShortName: "ТОВ ФИНОД2",
            ClientCode: "12321141",
            LegalForm: "OOO",
            OwnershipForm: "Приватна",
            IsResident: false,
          },
        };
        newCompany = await init(server, oldCompany, editResult, "company");
      });

      it("it get Company json History", (done) => {
        const HistoryCred = {
          id: newCompany.formDataResultId.toString(),
        };
        chai
          .request(server)
          .get("/api/history/company-history")
          .set("Authorization", token)
          .query({ ...HistoryCred })
          .end((err, res) => {
            res.body.result[0].diff.should.deep.equal([
              {
                op: "Додано",
                path: "Організаційно-правова форма",
                value: "OOO",
              },
              { op: "Додано", path: "Форма власності", value: "Приватна" },
              {
                op: "Замінено",
                path: "Скорочене найменування (за наявності)",
                was: "ТОВ ФИНОД",
                became: "ТОВ ФИНОД2",
              },
            ]);
            res.should.have.status(200);
            done();
          });
      });
      it("it get Person json History with auth err ", (done) => {
        const HistoryCred = {
          id: newCompany.formDataResultId.toString(),
        };
        chai
          .request(server)
          .get("/api/history/person-history")
          .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
          .query(HistoryCred)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });
      it("it negative test send get Person json History with not exists id property suspect validation err ", (done) => {
        const HistoryCred = {
          id: "10adf77dfb53d91e28576c74",
        };
        chai
          .request(server)
          .get("/api/history/person-history")
          .set("Authorization", token)
          .query(HistoryCred)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("message").eql("Validation error");
            res.body.should.have.property("validation").eql(false);
            res.body.should.deep.equal({
              message: "Validation error",
              validation: false,
              success: false,
              error: [
                {
                  value: "10adf77dfb53d91e28576c74",
                  msg: "Неверный id",
                  param: "id",
                  location: "query",
                },
              ],
            });
            done();
          });
      });
      it("it negative test send create new helper with null result suspesct validation err ", (done) => {
        const HistoryCred = {};
        chai
          .request(server)
          .get("/api/history/person-history")
          .set("Authorization", token)
          .query(HistoryCred)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("message").eql("Validation error");
            res.body.should.have.property("validation").eql(false);
            res.body.should.deep.equal({
              message: "Validation error",
              validation: false,
              success: false,
              error: [
                {
                  msg: "Поле id пустое",
                  param: "id",
                  location: "query",
                },
              ],
            });
            done();
          });
      });
    });

    describe("History/getCompanyHistoryFile ", () => {
      let newCompany;
      let oldCompany;

      before(async () => {
        await CompanyFormData.deleteMany({});
        await Company.deleteMany({});
        await History.deleteMany({});
        oldCompany = {
          result: {
            ShortName: "ТОВ ФИНОД",
            ClientCode: "12321141",
            IsResident: false,
          },
        };
        editResult = {
          result: {
            ShortName: "ТОВ ФИНОД2",
            ClientCode: "12321141",
            LegalForm: "OOO",
            OwnershipForm: "Приватна",
            IsResident: false,
          },
        };
        newCompany = await init(server, oldCompany, editResult, "company");
      });

      it("it get company History file", (done) => {
        const HistoryCred = {
          id: newCompany.formDataResultId.toString(),
        };
        chai
          .request(server)
          .get("/api/history/company-history-file")
          .set("Authorization", token)
          .query({ ...HistoryCred })
          .end((err, res) => {
            const wb = XLSX.read(res.body.result, { type: "base64" });
            let obj = {
              Історія: {
                "!ref": "A1:D5",
                A1: {
                  t: "s",
                  v: "Користувач: ",
                  h: "Користувач: ",
                  w: "Користувач: ",
                },
                B1: {
                  t: "s",
                  v: "alexandrMorozzz12",
                  h: "alexandrMorozzz12",
                  w: "alexandrMorozzz12",
                },
                C1: {
                  t: "s",
                  v: "Дата створенно",
                  h: "Дата створенно",
                  w: "Дата створенно",
                },
                A2: { t: "s", v: "Додано", h: "Додано", w: "Додано" },
                B2: {
                  t: "s",
                  v: "Організаційно-правова форма",
                  h: "Організаційно-правова форма",
                  w: "Організаційно-правова форма",
                },
                C2: { t: "s", v: "OOO", h: "OOO", w: "OOO" },
                A3: { t: "s", v: "Додано", h: "Додано", w: "Додано" },
                B3: {
                  t: "s",
                  v: "Форма власності",
                  h: "Форма власності",
                  w: "Форма власності",
                },
                C3: { t: "s", v: "Приватна", h: "Приватна", w: "Приватна" },
                A4: { t: "s", v: "Замінено", h: "Замінено", w: "Замінено" },
                B4: {
                  t: "s",
                  v: "Скорочене найменування (за наявності)",
                  h: "Скорочене найменування (за наявності)",
                  w: "Скорочене найменування (за наявності)",
                },
                C4: { t: "s", v: "was", h: "was", w: "was" },
                D4: { t: "s", v: "ТОВ ФИНОД", h: "ТОВ ФИНОД", w: "ТОВ ФИНОД" },
                C5: { t: "s", v: "became", h: "became", w: "became" },
                D5: {
                  t: "s",
                  v: "ТОВ ФИНОД2",
                  h: "ТОВ ФИНОД2",
                  w: "ТОВ ФИНОД2",
                },
              },
            };
            wb.Sheets["Історія"].should
              .excluding(["D1"])
              .deep.equal(obj["Історія"]);
            res.should.have.status(200);
            done();
          });
      });
      it("it get company history file with auth err ", (done) => {
        const HistoryCred = {
          id: newCompany._id.toString(),
        };
        chai
          .request(server)
          .get("/api/history/company-history-file")
          .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
          .query(HistoryCred)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });
      it("it negative test send get company history file with not exists id property suspect validation err ", (done) => {
        const HistoryCred = {
          id: "10adf77dfb53d91e28576c74", //not exists id
        };
        chai
          .request(server)
          .get("/api/history/company-history-file")
          .set("Authorization", token)
          .query(HistoryCred)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("message").eql("Validation error");
            res.body.should.have.property("validation").eql(false);
            res.body.should.deep.equal({
              message: "Validation error",
              validation: false,
              success: false,
              error: [
                {
                  value: "10adf77dfb53d91e28576c74",
                  msg: "Неверный id",
                  param: "id",
                  location: "query",
                },
              ],
            });
            done();
          });
      });
      it("it negative test send get company history file with null result suspesct validation err ", (done) => {
        const HistoryCred = {};
        chai
          .request(server)
          .get("/api/history/company-history-file")
          .set("Authorization", token)
          .query(HistoryCred)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("message").eql("Validation error");
            res.body.should.have.property("validation").eql(false);
            res.body.should.deep.equal({
              message: "Validation error",
              validation: false,
              success: false,
              error: [
                {
                  msg: "Поле id пустое",
                  param: "id",
                  location: "query",
                },
              ],
            });
            done();
          });
      });
    });
  });
};
module.exports = test;
