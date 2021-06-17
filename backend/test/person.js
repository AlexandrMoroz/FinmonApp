const chai = require("chai");
const chaihttp = require("chai-http");
const chaiExclude = require("chai-exclude");
chai.config.includeStack = true;
let XLSX = require("xlsx");

const diffHistory = require("mongoose-diff-history/diffHistory");
const History = require("mongoose-diff-history/diffHistoryModel").model;
const Helper = require("../models/helper");
const Person = require("../models/person");
const PersonFormData = require("../models/personFormData");
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
  describe("test Person api", () => {
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
    describe("Person/create ", () => {
      beforeEach(async function () {
        await Person.deleteMany({});
        await PersonFormData.deleteMany({});
      });

      it("it create new Person ", (done) => {
        const CreatePerson = {
          result: {
            Name: "Alexandr",
            Family: "Moroz",
            Surname: "Sergeevich",
            INN: "2312234312",
          },
        };
        chai
          .request(server)
          .post("/api/person/create")
          .set("Authorization", token)
          .send(CreatePerson)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.result.should
              .excluding([
                "_id",
                "formDataResultId",
                "createdAt",
                "updatedAt",
                "__v",
              ])
              .deep.equal({
                name: CreatePerson.result.Name,
                family: CreatePerson.result.Family,
                surname: CreatePerson.result.Surname,
                INN: CreatePerson.result.INN,
                username: user.username,
              });
            done();
          });
      });
      it("it create new Person with auth err ", (done) => {
        const CreatePerson = {
          result: {
            Name: "Alexandr",
            Family: "Moroz",
            Surname: "Sergeevich",
            INN: "2312234312",
          },
        };
        chai
          .request(server)
          .post("/api/person/create")
          .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
          .send(CreatePerson)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });
      it("it negative test send create new Person with mistake property name suspect validation err ", (done) => {
        const CreatePerson = {
          result: {
            Name2: "Alexandr",
            Family: "Moroz",
            Surname: "Sergeevich",
            INN: "2312234312",
          },
        };
        chai
          .request(server)
          .post("/api/person/create")
          .set("Authorization", token)
          .send(CreatePerson)
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
                  msg: "Поле Имя не найденно",
                  param: "result.Name",
                  location: "body",
                },
              ],
            });
            done();
          });
      });
      it("it negative test send create new Person with null result suspesct validation err ", (done) => {
        const Person = {
          result: {},
        };
        chai
          .request(server)
          .post("/api/person/create")
          .set("Authorization", token)
          .send(Person)
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
                  msg: "Поле Имя не найденно",
                  param: "result.Name",
                  location: "body",
                },
                {
                  msg: "Поле Фамилия пустое",
                  param: "result.Family",
                  location: "body",
                },
                {
                  msg: "Поле ИНН пустое",
                  param: "result.INN",
                  location: "body",
                },
              ],
            });
            done();
          });
      });
    });
    describe("Person/edit ", () => {
      let newPerson;
      let newPersonFormData;
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
          },
        };
        newPersonFormData = await new PersonFormData({
          result: oldPerson.result,
        }).save();
        newPerson = await new Person({
          name: oldPerson.result.Name,
          family: oldPerson.result.Family,
          surname: oldPerson.result.Surname,
          INN: oldPerson.result.INN,
          username: user.username,
          formDataResultId: newPersonFormData._id,
        }).save();
      });

      it("it edit Person ", (done) => {
        let editPerson = {
          result: {
            Name: "Alexandr2",
            Family: "Moroz2",
            Surname: "Sergeevich2",
            DateOfFirstSigned: "12.12.2021",
            INN: "2312234312",
          },
          formDataResultId: newPersonFormData._id,
          _id: newPerson._id,
        };
        chai
          .request(server)
          .put("/api/person/edit")
          .set("Authorization", token)
          .send(editPerson)
          .end(async (err, res) => {
            res.body.result.should
              .excluding(["createdAt", "updatedAt", "__v"])
              .deep.equal({
                _id: editPerson._id.toString(),
                name: editPerson.result.Name,
                family: editPerson.result.Family,
                surname: editPerson.result.Surname,
                INN: editPerson.result.INN,
                username: user.username,
                formDataResultId: editPerson.formDataResultId.toString(),
              });
            res.should.have.status(200);
            if (err) {
              done(err);
            }
            done();
          });
      });
      it("it edit Person and cheak history ", (done) => {
        let editPerson = {
          result: {
            Name: "Alexandr2",
            Family: "Moroz2",
            Surname: "Sergeevich2",
            DateOfFirstSigned: "12.12.2021",
            INN: "2312234312",
          },
          formDataResultId: newPersonFormData._id,
          _id: newPerson._id,
        };
        chai
          .request(server)
          .put("/api/person/edit")
          .set("Authorization", token)
          .send(editPerson)
          .end(async (err, res) => {
            res.should.have.status(200);
            let history = await diffHistory.getDiffs(
              "PersonFormData",
              res.body.result.formDataResultId
            );

            let historyRes = history[0].diff.result;
            historyRes.should.deep.equal({
              Name: [oldPerson.result.Name, editPerson.result.Name],
              Family: [oldPerson.result.Family, editPerson.result.Family],
              Surname: [oldPerson.result.Surname, editPerson.result.Surname],
              DateOfFirstSigned: [editPerson.result.DateOfFirstSigned],
            });
            done();
          });
      });
      it("it negative test edit Person with mising field", (done) => {
        let editPerson = {
          result: {
            //Name2: "Alexandr2",
            Family: "Moroz2",
            Surname: "Sergeevich2",
            DateOfFirstSigned: "12.12.2021",
            INN: "2312234312",
          },
          formDataResultId: newPersonFormData._id,
          _id: newPerson._id,
        };
        chai
          .request(server)
          .put("/api/person/edit")
          .set("Authorization", token)
          .send(editPerson)
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
                  msg: "Поле Имя не найденно",
                  param: "result.Name",
                  location: "body",
                },
              ],
            });
            done();
          });
      });
      it("it negative test edit Person with wrong Name type ", (done) => {
        let editPerson = {
          result: {
            Name: 123123,
            Family: "Moroz2",
            Surname: "Sergeevich2",
            DateOfFirstSigned: "12.12.2021",
            INN: "2312234312",
          },
          formDataResultId: newPersonFormData._id,
          _id: newPerson._id,
        };
        chai
          .request(server)
          .put("/api/person/edit")
          .set("Authorization", token)
          .send(editPerson)
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
                  value: 123123,
                  msg: "Поле Имя должнол быть строкой",
                  param: "result.Name",
                  location: "body",
                },
              ],
            });
            done();
          });
      });
      it("it negative test edit Person with empty Name ", (done) => {
        let editPerson = {
          result: {
            Name: "",
            Family: "Moroz2",
            Surname: "Sergeevich2",
            DateOfFirstSigned: "12.12.2021",
            INN: "2312234312",
          },
          formDataResultId: newPersonFormData._id,
          _id: newPerson._id,
        };
        chai
          .request(server)
          .put("/api/person/edit")
          .set("Authorization", token)
          .send(editPerson)
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
                  msg: "Поле Имя должно содержать больше 1 символа",
                  param: "result.Name",
                  location: "body",
                },
              ],
            });
            done();
          });
      });
    });

    describe("Person/search", () => {
      let newPerson;
      let newPersonFormData;
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
          },
        };
        newPersonFormData = await new PersonFormData({
          result: oldPerson.result,
        }).save();
        newPerson = await new Person({
          name: oldPerson.result.Name,
          family: oldPerson.result.Family,
          surname: oldPerson.result.Surname,
          INN: oldPerson.result.INN,
          username: user.username,
          formDataResultId: newPersonFormData._id,
        }).save();
      });
      it("it search Person ", (done) => {
        let searchPerson = {
          searchText: "Alexandr",
        };
        chai
          .request(server)
          .get("/api/person/search")
          .set("Authorization", token)
          .query(searchPerson)
          .end(async (err, res) => {
            res.should.have.status(200);
            res.body.result.should
              .excluding(["createdAt", "updatedAt", "__v"])
              .deep.equal([
                {
                  _id: newPerson._id.toString(),
                  name: oldPerson.result.Name,
                  family: oldPerson.result.Family,
                  surname: oldPerson.result.Surname,
                  INN: oldPerson.result.INN,
                  username: user.username,
                  formDataResultId: newPersonFormData._id.toString(),
                },
              ]);
            if (err) {
              done(err);
            }
            done();
          });
      });
      it("it negative test serch Person with empty searchtext ", (done) => {
        let searchPerson = {
          searchText: "",
        };
        chai
          .request(server)
          .get("/api/person/search")
          .set("Authorization", token)
          .query(searchPerson)
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
                  msg: "Поле Поиска должно содержать более 2 символов",
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
      it("it negative test serch Person with wrong searchtext name ", (done) => {
        let searchPerson = {
          searchText1: "1234567",
        };
        chai
          .request(server)
          .get("/api/person/search")
          .set("Authorization", token)
          .query(searchPerson)
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
      it("it negative test serch Person with 1 charter searchtext lenght  ", (done) => {
        let searchPerson = {
          searchText: "1",
        };
        chai
          .request(server)
          .get("/api/person/search")
          .set("Authorization", token)
          .query(searchPerson)
          .end(async (err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("message").eql("Validation error");
            res.body.should.have.property("validation").eql(false);
            if (err) {
              done(err);
            }
            done();
          });
      });
    });

    describe("Person/getById", () => {
      let newPerson;
      let newPersonFormData;
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
          },
        };
        newPersonFormData = await new PersonFormData({
          result: oldPerson.result,
        }).save();
        newPerson = await new Person({
          name: oldPerson.result.Name,
          family: oldPerson.result.Family,
          surname: oldPerson.result.Surname,
          INN: oldPerson.result.INN,
          username: user.username,
          formDataResultId: newPersonFormData._id,
        }).save();
      });
      it("it get Person form data by id", (done) => {
        chai
          .request(server)
          .get("/api/person/form-data")
          .set("Authorization", token)
          .query({ id: newPerson.formDataResultId.toString() })
          .end(async (err, res) => {
            res.should.have.status(200);
            res.body.result.should
              .excluding([
                "_id",
                "formDataResultId",
                "createdAt",
                "updatedAt",
                "__v",
              ])
              .deep.equal({
                Name: oldPerson.result.Name,
                Family: oldPerson.result.Family,
                Surname: oldPerson.result.Surname,
                INN: oldPerson.result.INN,
              });
            done();
          });
      });
      it("it negative test get Person form data by id with wrong id", (done) => {
        chai
          .request(server)
          .get("/api/person/form-data")
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
      it("it negative test get Person form data by id with empty id", (done) => {
        chai
          .request(server)
          .get("/api/person/form-data")
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
    describe("Person/file", (done) => {
      let newPerson;
      let newPersonFormData;
      let oldPerson;
      before(async () => {
        await PersonFormData.deleteMany({});
        await Person.deleteMany({});
        await Helper.deleteMany({});
        await new Helper({
          name: translate.name,
          content: translate.content,
        }).save();
        oldPerson = {
          result: {
            Name: "Alexandr",
            Family: "Moroz",
            Surname: "Sergeevich",
            INN: "2312234312",
          },
        };
        newPersonFormData = await new PersonFormData({
          result: oldPerson.result,
        }).save();
        newPerson = await new Person({
          name: oldPerson.result.Name,
          family: oldPerson.result.Family,
          surname: oldPerson.result.Surname,
          INN: oldPerson.result.INN,
          username: user.username,
          formDataResultId: newPersonFormData._id,
        }).save();
      });
      it("it get Person buf of file  ", (done) => {
        chai
          .request(server)
          .get("/api/person/file")
          .set("Authorization", token)
          .query({ id: newPerson._id.toString() })
          .end(async (err, res) => {
            console.log(err)
            const wb = XLSX.read(res.body.result, { type: "base64" });
            let obj = {
              Анкета: {
                "!ref": "A1:D5",
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
                A2: { t: "s", v: "Ім'я", h: "Ім&apos;я", w: "Ім'я" },
                B2: { t: "s", v: "Alexandr", h: "Alexandr", w: "Alexandr" },
                A3: { t: "s", v: "Прізвище", h: "Прізвище", w: "Прізвище" },
                B3: { t: "s", v: "Moroz", h: "Moroz", w: "Moroz" },
                A4: {
                  t: "s",
                  v: "По батькові",
                  h: "По батькові",
                  w: "По батькові",
                },
                B4: {
                  t: "s",
                  v: "Sergeevich",
                  h: "Sergeevich",
                  w: "Sergeevich",
                },
                A5: { t: "s", v: "ІНПП", h: "ІНПП", w: "ІНПП" },
                B5: {
                  t: "s",
                  v: "2312234312",
                  h: "2312234312",
                  w: "2312234312",
                },
              },
            };
            wb.Sheets["Анкета"].should
              .excluding(["D1"])
              .deep.equal(obj["Анкета"]);
            res.should.have.status(200);

            done();
          });
      });
      it("it negative test get Person buf of file with wrong id  ", (done) => {
        chai
          .request(server)
          .get("/api/person/file")
          .set("Authorization", token)
          .query({ id: "60a6240e9874e015b03b25f2" }) //wrong id
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
      it("it negative test get Person buf of file with empty id  ", (done) => {
        chai
          .request(server)
          .get("/api/person/file")
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
