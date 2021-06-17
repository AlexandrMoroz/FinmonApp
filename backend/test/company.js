const chai = require("chai");
const chaihttp = require("chai-http");
const chaiExclude = require("chai-exclude");
chai.config.includeStack = true;
let XLSX = require("xlsx");

const diffHistory = require("mongoose-diff-history/diffHistory");
const History = require("mongoose-diff-history/diffHistoryModel").model;
const Helper = require("../models/helper");
const Company = require("../models/company");
const CompanyFormData = require("../models/companyFormData");
let translate = require("../mock/personTranslate.json");

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

let test = () => {
  describe("test company api", () => {
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
    describe("company/create ", () => {
      beforeEach(async function () {
        await Company.deleteMany({});
        await CompanyFormData.deleteMany({});
      });

      it("it create new company ", (done) => {
        const company = {
          result: {
            ShortName: "ТОВ ФИНОД",
            RegistNumber: "12321141",
          },
        };
        chai
          .request(server)
          .post("/api/company/create")
          .set("Authorization", token)
          .send(company)
          .end((err, res) => {
            res.should.have.status(201);
            done();
          });
      });
      it("it create new company with auth err ", (done) => {
        const company = {
          result: {
            ShortName: "ТОВ ФИНОД",
            RegistNumber: "1231141",
          },
        };
        chai
          .request(server)
          .post("/api/company/create")
          .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
          .send(company)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });
      it("it negative test send create new company with mistake property name suspect validation err ", (done) => {
        const company = {
          result: {
            ShortName1: "ТОВ ФИНОД",
            RegistNumber: "1231141",
          },
        };
        chai
          .request(server)
          .post("/api/company/create")
          .set("Authorization", token)
          .send(company)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("message").eql("Validation error");
            res.body.should.have.property("validation").eql(false);
            done();
          });
      });
      it("it negative test send create new company with null result suspesct validation err ", (done) => {
        const company = {
          result: {},
        };
        chai
          .request(server)
          .post("/api/company/create")
          .set("Authorization", token)
          .send(company)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("message").eql("Validation error");
            res.body.should.have.property("validation").eql(false);
            done();
          });
      });
    });
    describe("company/edit ", () => {
      let newCompany;
      let newCompanyFormData;
      let oldCompany;
      before(async () => {
        await CompanyFormData.deleteMany({});
        await Company.deleteMany({});
        await History.deleteMany({});
        oldCompany = {
          result: {
            ShortName: "ТОВ ФИНОД",
            RegistNumber: "12341141",
          },
        };
        newCompanyFormData = await new CompanyFormData({
          result: oldCompany.result,
        }).save();
        newCompany = await new Company({
          shortName: oldCompany.result.ShortName,
          registNumber: oldCompany.result.RegistNumber,
          username: user.username,
          formDataResultId: newCompanyFormData._id,
        }).save();
      });

      it("it edit company ", (done) => {
        let editCompany = {
          result: {
            ShortName: "ТОВ ФИНОД2",
            RegistNumber: "12341141",
            LegalForm: "OOO",
            OwnershipForm: "Приватна",
          },
          formDataResultId: newCompanyFormData._id,
          _id: newCompany._id,
        };
        chai
          .request(server)
          .put("/api/company/edit")
          .set("Authorization", token)
          .send(editCompany)
          .end(async (err, res) => {
            res.body.should.have.property("success");
            res.body.should.have.property("result");
            res.body.result.should
              .excluding(["createdAt", "updatedAt", "__v"])
              .deep.equal({
                _id: newCompany._id.toString(),
                shortName: editCompany.result.ShortName,
                registNumber: editCompany.result.RegistNumber,
                username: user.username,
                formDataResultId: newCompanyFormData._id.toString(),
              });
            res.should.have.status(200);
            if (err) {
              done(err);
            }
            done();
          });
      });
      it("it edit company and cheak history ", (done) => {
        let editCompany = {
          result: {
            ShortName: "ТОВ ФИНОД2",
            RegistNumber: "12341141",
            LegalForm: "OOO",
            OwnershipForm: "Приватна",
          },
          formDataResultId: newCompanyFormData._id,
          _id: newCompany._id,
        };
        chai
          .request(server)
          .put("/api/company/edit")
          .set("Authorization", token)
          .send(editCompany)
          .end(async (err, res) => {
            res.should.have.status(200);
            let history = await diffHistory.getDiffs(
              "CompanyFormData",
              res.body.result.formDataResultId
            );
            let historyRes = history[0].diff.result;
            historyRes.should.deep.equal({
              ShortName: [
                oldCompany.result.ShortName,
                editCompany.result.ShortName,
              ],
              LegalForm: [editCompany.result.LegalForm],
              OwnershipForm: [editCompany.result.OwnershipForm],
            });
            done();
          });
      });
      it("it negative test edit company with mising field", (done) => {
        let editCompany = {
          result: {
            ShortName2: "ТОВ ФИНОД2", //err
            RegistNumber: "12341141",
            LegalForm: "OOO",
            OwnershipForm: "Приватна",
          },
          formDataResultId: newCompanyFormData._id,
          _id: newCompany._id,
        };
        chai
          .request(server)
          .put("/api/company/edit")
          .set("Authorization", token)
          .send(editCompany)
          .end(async (err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("message").eql("Validation error");
            res.body.should.have.property("validation").eql(false);
            res.body.should.deep.equal({
              message: "Validation error",
              validation: false,
              success: false,
              error: [
                {
                  msg: "Поле (Скорочене наименування) пустое",
                  param: "result.ShortName",
                  location: "body",
                },
              ],
            });
            done();
          });
      });
      it("it negative test edit company with wrong ShortName type ", (done) => {
        let editCompany = {
          result: {
            ShortName: 12312, //err
            RegistNumber: "12341141",
            LegalForm: "OOO",
            OwnershipForm: "Приватна",
          },
          formDataResultId: newCompanyFormData._id,
          _id: newCompany._id,
        };
        chai
          .request(server)
          .put("/api/company/edit")
          .set("Authorization", token)
          .send(editCompany)
          .end(async (err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("message").eql("Validation error");
            res.body.should.have.property("validation").eql(false);
            res.body.should.deep.equal({
              message: "Validation error",
              validation: false,
              success: false,
              error: [
                {
                  value: 12312,
                  msg: "Поле (Скорочене наименування) должнол быть строкой",
                  param: "result.ShortName",
                  location: "body",
                },
              ],
            });
            done();
          });
      });
    });

    describe("company/search", () => {
      let oldCompany;
      let newCompany;

      before(async () => {
        await CompanyFormData.deleteMany({});
        await Company.deleteMany({});
        await History.deleteMany({});
        oldCompany = {
          result: {
            ShortName: "ТОВ ФИНОД",
            RegistNumber: "12341141",
          },
        };
        newCompanyFormData = await new CompanyFormData({
          result: oldCompany.result,
        }).save();
        newCompany = await new Company({
          shortName: oldCompany.result.ShortName,
          registNumber: oldCompany.result.RegistNumber,
          username: user.username,
          formDataResultId: newCompanyFormData._id,
        }).save();
      });
      it("it search company ", (done) => {
        let searchCompany = {
          searchText: "12341141",
        };
        chai
          .request(server)
          .get("/api/company/search")
          .set("Authorization", token)
          .query(searchCompany)
          .end(async (err, res) => {
            res.should.have.status(200);
            res.body.result.should
              .excluding(["createdAt", "updatedAt", "__v"])
              .deep.equal([
                {
                  _id: newCompany._id.toString(),
                  shortName: oldCompany.result.ShortName,
                  registNumber: oldCompany.result.RegistNumber,
                  username: user.username,
                  formDataResultId: newCompanyFormData._id.toString(),
                },
              ]);
            if (err) {
              done(err);
            }
            done();
          });
      });
      it("it negative test search company with empty searchtext ", (done) => {
        let searchCompany = {
          searchText: "",
        };
        chai
          .request(server)
          .get("/api/company/search")
          .set("Authorization", token)
          .query(searchCompany)
          .end(async (err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("message").eql("Validation error");
            res.body.should.have.property("validation").eql(false);
            res.body.should.deep.equal({
              message: "Validation error",
              validation: false,
              success: false,
              error: [
                {
                  value: "",
                  msg: "Поле Поиска должно содержать больше 2 символа",
                  param: "searchText",
                  location: "query",
                },
              ],
            });
            if (err) {
              done(err);
            }
            done();
          });
      });
      it("it negative test search company with wrong searchtext name ", (done) => {
        let searchCompany = {
          searchText1: "1234567",
        };
        chai
          .request(server)
          .get("/api/company/search")
          .set("Authorization", token)
          .query(searchCompany)
          .end(async (err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("message").eql("Validation error");
            res.body.should.have.property("validation").eql(false);
            res.body.should.deep.equal({
              message: "Validation error",
              validation: false,
              success: false,
              error: [
                {
                  msg: "Поле Поиска пустое",
                  param: "searchText",
                  location: "query",
                },
              ],
            });
            if (err) {
              done(err);
            }
            done();
          });
      });
      it("it negative test search company with 1 charter searchtext lenght   ", (done) => {
        let searchCompany = {
          searchText: "1",
        };
        chai
          .request(server)
          .get("/api/company/search")
          .set("Authorization", token)
          .query(searchCompany)
          .end(async (err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("message").eql("Validation error");
            res.body.should.have.property("validation").eql(false);
            res.body.should.deep.equal({
              message: "Validation error",
              validation: false,
              success: false,
              error: [
                {
                  value: "1",
                  msg: "Поле Поиска должно содержать больше 2 символа",
                  param: "searchText",
                  location: "query",
                },
              ],
            });
            if (err) {
              done(err);
            }
            done();
          });
      });
    });

    describe("company/getById", () => {
      let oldCompany = null;
      let newCompany = null;
      let newCompanyFormData = null;
      before(async () => {
        await CompanyFormData.deleteMany({});
        await Company.deleteMany({});
        await History.deleteMany({});
        oldCompany = {
          result: {
            ShortName: "ТОВ ФИНОД",
            RegistNumber: "12341141",
          },
        };
        newCompanyFormData = await new CompanyFormData({
          result: oldCompany.result,
        }).save();
        newCompany = await new Company({
          shortName: oldCompany.result.ShortName,
          registNumber: oldCompany.result.RegistNumber,
          username: user.username,
          formDataResultId: newCompanyFormData._id.toString(),
        }).save();
      });
      it("it get company form data by id", (done) => {
        chai
          .request(server)
          .get("/api/company/form-data")
          .set("Authorization", token)
          .query({ id: newCompany.formDataResultId.toString() })
          .end(async (err, res) => {
            res.should.have.status(200);
            res.body.result.should.deep.equal({
              ShortName: oldCompany.result.ShortName,
              RegistNumber: oldCompany.result.RegistNumber,
            });
            if (err) {
              done(err);
            }
            done();
          });
      });
      it("it negative test get company form data by id with wrong id", (done) => {
        chai
          .request(server)
          .get("/api/company/form-data")
          .set("Authorization", token)
          .query({ id: "60a6240e9874e015b03b25f2" }) //wrong id
          .end(async (err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("message").eql("Validation error");
            res.body.should.have.property("validation").eql(false);
            res.body.should.have.property("error").deep.equal([
              {
                value: "60a6240e9874e015b03b25f2",
                msg: "Неверный id",
                param: "id",
                location: "query",
              },
            ]);
            //res.body.
            if (err) {
              done(err);
            }
            done();
          });
      });
      it("it negative test get company form data by id with empty id", (done) => {
        chai
          .request(server)
          .get("/api/company/form-data")
          .set("Authorization", token)
          .query({ id: "" }) //wrong id
          .end(async (err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("message").eql("Validation error");
            res.body.should.have.property("validation").eql(false);
            res.body.should.have.property("error").deep.equal([
              {
                value: "",
                msg: "Неверный тип id",
                param: "id",
                location: "query",
              },
            ]);
            //res.body.
            if (err) {
              done(err);
            }
            done();
          });
      });
    });

    describe("company/file", () => {
      let oldCompany;
      let newCompany;

      before(async () => {
        await CompanyFormData.deleteMany({});
        await Company.deleteMany({});
        await Helper.deleteMany({});
        await new Helper({
          name: translate.name,
          content: translate.content,
        }).save();

        oldCompany = {
          result: {
            ShortName: "ТОВ ФИНОД",
            RegistNumber: "12341141",
          },
        };
        newCompanyFormData = await new CompanyFormData({
          result: oldCompany.result,
        }).save();
        newCompany = await new Company({
          shortName: oldCompany.result.ShortName,
          registNumber: oldCompany.result.RegistNumber,
          username: user.username,
          formDataResultId: newCompanyFormData._id,
        }).save();
      });
      it("it get company buf of file  ", (done) => {
        chai
          .request(server)
          .get("/api/company/file")
          .set("Authorization", token)
          .query({ id: newCompany._id.toString() })
          .end(async (err, res) => {
            const wb = XLSX.read(res.body.result, { type: "base64" });
            let obj = {
              Анкета: {
                "!ref": "A1:D3",
                A1: {
                  t: "s",
                  v: "Створенно користувачем",
                  h: "Створенно користувачем",
                  w: "Створенно користувачем",
                },
                B1: {
                  t: "s",
                  v: "moroz1 alexandr1 sergeevich1",
                  h: "moroz1 alexandr1 sergeevich1",
                  w: "moroz1 alexandr1 sergeevich1",
                },
                C1: {
                  t: "s",
                  v: "Дата створення:",
                  h: "Дата створення:",
                  w: "Дата створення:",
                },
                A2: {
                  t: "s",
                  v: "Скорочене найменування (за наявності)",
                  h: "Скорочене найменування (за наявності)",
                  w: "Скорочене найменування (за наявності)",
                },
                B2: { t: "s", v: "ТОВ ФИНОД", h: "ТОВ ФИНОД", w: "ТОВ ФИНОД" },
                A3: {
                  t: "s",
                  v: "Реєстраційний (обліковий) номер",
                  h: "Реєстраційний (обліковий) номер",
                  w: "Реєстраційний (обліковий) номер",
                },
                B3: { t: "s", v: "12341141", h: "12341141", w: "12341141" },
              },
            };
            wb.Sheets["Анкета"].should
              .excluding(["D1"])
              .deep.equal(obj["Анкета"]);
            res.should.have.status(200);
            done();
          });
      });
      it("it negative test get company buf of file with wrong id  ", (done) => {
        chai
          .request(server)
          .get("/api/company/file")
          .set("Authorization", token)
          .query({ id: "60a6240e9874e015b03b25f2" })
          .end(async (err, res) => {
            res.body.should.deep.equal({
              message: "Validation error",
              validation: false,
              success: false,
              error: [
                {
                  value: "60a6240e9874e015b03b25f2",
                  msg: "Неверный id",
                  param: "id",
                  location: "query",
                },
              ],
            });
            res.should.have.status(400);
            done();
          });
      });
      it("it negative test get company buf of file with empty id  ", (done) => {
        chai
          .request(server)
          .get("/api/company/file")
          .set("Authorization", token)
          .query({ id: "" })
          .end(async (err, res) => {
            res.body.should.deep.equal({
              message: "Validation error",
              validation: false,
              success: false,
              error: [
                {
                  value: "",
                  msg: "Неверный тип id",
                  param: "id",
                  location: "query",
                },
              ],
            });
            res.should.have.status(400);
            done();
          });
      });
    });
  });
};
module.exports = test;
