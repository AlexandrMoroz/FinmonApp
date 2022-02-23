const chai = require("chai");
const chaihttp = require("chai-http");
const chaiExclude = require("chai-exclude");
chai.config.includeStack = true;
let XLSX = require("xlsx");

const diffHistory = require("mongoose-diff-history/diffHistory");
const historyService = require("../services/history");

const helperService = require("../services/helper");
const companyService = require("../services/company");
const userService = require("../services/user");
let translate = require("../mock/personTranslate.json");

let token = "";
const user = require("../mock/adminUser.json");
chai.should();
chai.use(chaihttp);
chai.use(chaiExclude);
let init = async (oldCompany) => {
  await historyService.deleteAll();
  await companyService.deleteAll();
  await helperService.deleteAll();
  await helperService.create(translate.name, translate.result);
  return await companyService.create(user.username, oldCompany.result);
};
module.exports = (server) => {
  describe("test company api", () => {
    before(async () => {
      await userService.deleteAll();
      await userService.create(user);
      let res = await chai.request(server).post("/api/user/login").send({
        username: user.username,
        password: user.password,
      });
      token = res.body.token;
    });
    describe("company/create ", () => {
      beforeEach(async function () {
        await companyService.deleteAll();
      });

      it("it create new company ", (done) => {
        const company = {
          result: {
            ShortName: "ТОВ ФИНОД",
            ClientCode: "12321141",
            IsResident: false,
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
            ClientCode: "1231141",
            IsResident: false,
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
            ClientCode: "1231141",
            IsResident: false,
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
    describe("company/edit ", async () => {
      let newCompany;
      let oldCompany;
      before(async () => {
        oldCompany = {
          result: {
            ShortName: "ТОВ ФИНОД",
            ClientCode: "12341141",
            IsResident: false,
          },
        };
        newCompany = await init(oldCompany);
      });

      it("it edit company ", async () => {
        let editCompany = {
          result: {
            ShortName: "ТОВ ФИНОД2",
            ClientCode: "12341141",
            LegalForm: "OOO",
            OwnershipForm: "Приватна",
            IsResident: false,
          },
          formDataResultId: newCompany.formDataResultId,
          _id: newCompany._id,
        };
        let res = await chai
          .request(server)
          .put("/api/company/edit")
          .set("Authorization", token)
          .send(editCompany);

        res.body.result.should
          .excluding(["createdAt", "updatedAt", "__v"])
          .deep.equal({
            _id: newCompany._id.toString(),
            shortName: editCompany.result.ShortName,
            clientCode: editCompany.result.ClientCode,
            username: user.username,
            formDataResultId: newCompany.formDataResultId.toString(),
          });
        res.should.have.status(200);
      });
      it("it edit company and cheak history ", async () => {
        let editCompany = {
          result: {
            ShortName: "ТОВ ФИНОД2",
            ClientCode: "12341141",
            LegalForm: "OOO",
            OwnershipForm: "Приватна",
            IsResident: false,
          },
          formDataResultId: newCompany.formDataResultId,
          _id: newCompany._id,
        };
        let res = await chai
          .request(server)
          .put("/api/company/edit")
          .set("Authorization", token)
          .send(editCompany);
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
      });
      it("it negative test edit company with mising field", async () => {
        let editCompany = {
          result: {
            ShortName2: "ТОВ ФИНОД2", //err
            ClientCode: "12341141",
            LegalForm: "OOO",
            OwnershipForm: "Приватна",
            IsResident: false,
          },
          formDataResultId: newCompany.formDataResultId,
          _id: newCompany._id,
        };
        let res = await chai
          .request(server)
          .put("/api/company/edit")
          .set("Authorization", token)
          .send(editCompany);

        res.should.have.status(400);
        res.body.should.deep.equal({
          message: "Validation error",
          validation: false,
          success: false,
          error: [
            {
              msg: "Поле (Скорочене наименування) порожне",
              param: "result.ShortName",
              location: "body",
            },
          ],
        });
      });
      it("it negative test edit company with wrong ShortName type ", async () => {
        try {
          let editCompany = {
            result: {
              ShortName: 12312, //err
              ClientCode: "12341141",
              LegalForm: "OOO",
              OwnershipForm: "Приватна",
              IsResident: false,
            },
            formDataResultId: newCompany.formDataResultId,
            _id: newCompany._id,
          };
          let res = await chai
            .request(server)
            .put("/api/company/edit")
            .set("Authorization", token)
            .send(editCompany);
          res.should.have.status(400);
          res.body.should.deep.equal({
            message: "Validation error",
            validation: false,
            success: false,
            error: [
              {
                value: 12312,
                msg: "Поле (Скорочене наименування) повинно бути строкою",
                param: "result.ShortName",
                location: "body",
              },
            ],
          });
        } catch (err) {
          console.log(err);
        }
      });
    });
    describe("company/search", () => {
      let oldCompany;
      let newCompany;

      before(async () => {
        oldCompany = {
          result: {
            ShortName: "ТОВ ФИНОД",
            ClientCode: "12341141",
            IsResident: false,
          },
        };
        newCompany = await init(oldCompany);
      });
      it("it search company ", async () => {
        let searchCompany = {
          searchText: "12341141",
        };
        let res = await chai
          .request(server)
          .get("/api/company/search")
          .set("Authorization", token)
          .query(searchCompany);

        res.should.have.status(200);
        res.body.result.should
          .excluding(["createdAt", "updatedAt", "__v"])
          .deep.equal([
            {
              _id: newCompany._id.toString(),
              shortName: newCompany.shortName,
              clientCode: newCompany.clientCode,
              username: user.username,
              formDataResultId: newCompany.formDataResultId.toString(),
            },
          ]);
      });
      it("it negative test search company with empty searchtext ", async () => {
        let searchCompany = {
          searchText: "",
        };
        let res = await chai
          .request(server)
          .get("/api/company/search")
          .set("Authorization", token)
          .query(searchCompany);
        res.should.have.status(400);
        res.body.should.deep.equal({
          message: "Validation error",
          validation: false,
          success: false,
          error: [
            {
              value: "",
              msg: "Поле Пошуку повинно містити більше 2 символів",
              param: "searchText",
              location: "query",
            },
          ],
        });
      });
      it("it negative test search company with wrong searchtext name ", async () => {
        let searchCompany = {
          searchText1: "1234567", //err
        };
        let res = await chai
          .request(server)
          .get("/api/company/search")
          .set("Authorization", token)
          .query(searchCompany);
        res.should.have.status(400);
        res.body.should.have.property("message").eql("Validation error");
        res.body.should.have.property("validation").eql(false);
        res.body.should.deep.equal({
          message: "Validation error",
          validation: false,
          success: false,
          error: [
            {
              msg: "Поле Пошуку порожне",
              param: "searchText",
              location: "query",
            },
          ],
        });
      });
      it("it negative test search company with 1 charter searchtext lenght   ", async () => {
        let searchCompany = {
          searchText: "1",
        };
        let res = await chai
          .request(server)
          .get("/api/company/search")
          .set("Authorization", token)
          .query(searchCompany);
        res.should.have.status(400);
        res.body.should.deep.equal({
          message: "Validation error",
          validation: false,
          success: false,
          error: [
            {
              value: "1",
              msg: "Поле Пошуку повинно містити більше 2 символів",
              param: "searchText",
              location: "query",
            },
          ],
        });
      });
    });
    describe("company/getById", () => {
      let oldCompany;
      let newCompany;
      before(async () => {
        oldCompany = {
          result: {
            ShortName: "ТОВ ФИНОД",
            ClientCode: "12341141",
            IsResident: false,
          },
        };
        newCompany = await init(oldCompany);
      });
      it("it get company form data by id", (done) => {
        chai
          .request(server)
          .get("/api/company/form-data")
          .set("Authorization", token)
          .query({ id: newCompany.formDataResultId.toString() })
          .end(async (err, res) => {
            res.body.result.should.deep.equal({
              ShortName: oldCompany.result.ShortName,
              ClientCode: oldCompany.result.ClientCode,
              IsResident: false,
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
                msg: "Дані компанії за _id не знайденно ",
                param: "id",
                location: "query",
              },
            ]);
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
                msg: "Невірний тип id",
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
        oldCompany = {
          result: {
            ShortName: "ТОВ ФИНОД",
            ClientCode: "12341141",
            IsResident: false,
          },
        };
        newCompany = await init(oldCompany);
      });
      it("it get company buf of file  ", async () => {
        let res = await chai
          .request(server)
          .get("/api/company/file")
          .set("Authorization", token)
          .query({ id: newCompany._id.toString() });
        const wb = XLSX.read(res.body.result, { type: "base64" });
        let shouldEquals = {
          "!ref": "A1:D4",
          A1: {
            t: "s",
            v: "Анкета Юридичної особи Не резидента",
            h: "Анкета Юридичної особи Не резидента",
            w: "Анкета Юридичної особи Не резидента",
          },
          A2: {
            t: "s",
            v: "Створенно користувачем",
            h: "Створенно користувачем",
            w: "Створенно користувачем",
          },
          B2: {
            t: "s",
            v: "moroz1 alexandr1 sergeevich1",
            h: "moroz1 alexandr1 sergeevich1",
            w: "moroz1 alexandr1 sergeevich1",
          },
          C2: {
            t: "s",
            v: "Дата створення:",
            h: "Дата створення:",
            w: "Дата створення:",
          },
          D2: {
            t: "s",
            v: "23/02/2022, 11:19:46",
            h: "23/02/2022, 11:19:46",
            w: "23/02/2022, 11:19:46",
          },
          A3: {
            t: "s",
            v: "Скорочене найменування (за наявності)",
            h: "Скорочене найменування (за наявності)",
            w: "Скорочене найменування (за наявності)",
          },
          B3: { t: "s", v: "ТОВ ФИНОД", h: "ТОВ ФИНОД", w: "ТОВ ФИНОД" },
          A4: {
            t: "s",
            v: "Код (за наявності) клієнта",
            h: "Код (за наявності) клієнта",
            w: "Код (за наявності) клієнта",
          },
          B4: { t: "s", v: "12341141", h: "12341141", w: "12341141" },
        };
        wb.Sheets["Анкета"].should.excluding(["D2"]).deep.equal(shouldEquals);
        res.should.have.status(200);
      });
      it("it negative test get company buf of file with wrong id  ", async () => {
        let res = await chai
          .request(server)
          .get("/api/company/file")
          .set("Authorization", token)
          .query({ id: "60a6240e9874e015b03b25f2" });
        res.body.should.deep.equal({
          message: "Validation error",
          validation: false,
          success: false,
          error: [
            {
              value: "60a6240e9874e015b03b25f2",
              msg: "Невірний id",
              param: "id",
              location: "query",
            },
          ],
        });
        res.should.have.status(400);
      });
      it("it negative test get company buf of file with empty id  ", async () => {
        let res = await chai
          .request(server)
          .get("/api/company/file")
          .set("Authorization", token)
          .query({ id: "" });
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
        res.should.have.status(400);
      });
    });
  });
};
