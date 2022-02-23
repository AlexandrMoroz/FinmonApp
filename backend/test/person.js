const chai = require("chai");
const chaihttp = require("chai-http");
const chaiExclude = require("chai-exclude");
chai.config.includeStack = true;
let XLSX = require("xlsx");
const diffHistory = require("mongoose-diff-history/diffHistory");
const historyService = require("../services/history");
const helperService = require("../services/helper");
const personService = require("../services/person");
const userService = require("../services/user");
let translate = require("../mock/personTranslate.json");

let token = "";
const user = require("../mock/adminUser.json");
chai.should();
chai.use(chaihttp);
chai.use(chaiExclude);
let init = async (oldPerson) => {
  await personService.deleteAll();
  return await personService.create(user.username, oldPerson);
};
let test = (server) => {
  describe("test Person api", () => {
    before(async () => {
      await userService.deleteAll();
      await userService.create(user);
      let res = await chai.request(server).post("/api/user/login").send({
        username: user.username,
        password: user.password,
      });
      token = res.body.token;
    });
    describe("Person/create ", () => {
      beforeEach(async function () {
        await personService.deleteAll();
      });

      it("it create new Person ", async () => {
        const CreatePerson = {
          result: {
            Name: "Alexandr",
            Family: "Moroz",
            Surname: "Sergeevich",
            Regist: {
              Country: "Україна",
              Adress: "123123",
            },
            Live: {
              Country: "Україна",
              Adress: "123123",
            },
            INN: "2312234312",
            IsResident: true,
          },
        };
        let res = await chai
          .request(server)
          .post("/api/person/create")
          .set("Authorization", token)
          .send(CreatePerson);
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
      });
      it("it create new Person with auth err ", async () => {
        const CreatePerson = {
          result: {
            Name: "Alexandr",
            Family: "Moroz",
            Surname: "Sergeevich",
            INN: "2312234312",
          },
        };
        let res = await chai
          .request(server)
          .post("/api/person/create")
          .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
          .send(CreatePerson);

        res.should.have.status(401);
      });
      it("it negative test send create new Person with mistake property name suspect validation err ", async () => {
        const CreatePerson = {
          result: {
            Name2: "Alexandr",
            Family: "Moroz",
            Surname: "Sergeevich",
            INN: "2312234312",
          },
        };
        let res = await chai
          .request(server)
          .post("/api/person/create")
          .set("Authorization", token)
          .send(CreatePerson);

        res.should.have.status(400);
        res.body.should.deep.equal({
          message: "Validation error",
          validation: false,
          success: false,
          error: [
            {
              msg: "Поле Резидент порожнє",
              param: "result.IsResident",
              location: "body",
            },
            {
              msg: "Поле Имя порожнє",
              param: "result.Name",
              location: "body",
            },
            {
              location: "body",
              msg: "Поле місце реєстрації порожнє",
              param: "result.Regist",
            },
            {
              location: "body",
              msg: "Поле країна порожнє",
              param: "result.Regist.Country",
            },
            {
              location: "body",
              msg: "Поле адресс порожнє",
              param: "result.Regist.Adress",
            },
            {
              location: "body",
              msg: "Поле місце проживання порожнє",
              param: "result.Live",
            },
            {
              location: "body",
              msg: "Поле країна порожнє",
              param: "result.Live.Country",
            },
            {
              location: "body",
              msg: "Поле адресс порожнє",
              param: "result.Live.Adress",
            },
            {
              location: "body",
              msg: "В не резидента повинено бути громадянство",
              param: "result.Citizen",
            },
          ],
        });
      });
      it("it negative test send create new Person with null result suspesct validation err ", async () => {
        const Person = {
          result: {},
        };
        let res = await chai
          .request(server)
          .post("/api/person/create")
          .set("Authorization", token)
          .send(Person);

        res.should.have.status(400);
        res.body.should.deep.equal({
          message: "Validation error",
          validation: false,
          success: false,
          error: [
            {
              msg: "Поле Резидент порожнє",
              param: "result.IsResident",
              location: "body",
            },
            {
              msg: "Поле Имя порожнє",
              param: "result.Name",
              location: "body",
            },
            {
              msg: "Поле Фамилия порожнє",
              param: "result.Family",
              location: "body",
            },
            {
              location: "body",
              msg: "Поле місце реєстрації порожнє",
              param: "result.Regist",
            },
            {
              location: "body",
              msg: "Поле країна порожнє",
              param: "result.Regist.Country",
            },
            {
              location: "body",
              msg: "Поле адресс порожнє",
              param: "result.Regist.Adress",
            },
            {
              location: "body",
              msg: "Поле місце проживання порожнє",
              param: "result.Live",
            },
            {
              location: "body",
              msg: "Поле країна порожнє",
              param: "result.Live.Country",
            },
            {
              location: "body",
              msg: "Поле адресс порожнє",
              param: "result.Live.Adress",
            },
            {
              location: "body",
              msg: "В не резидента повинено бути громадянство",
              param: "result.Citizen",
            },
          ],
        });
      });
    });
    describe("Person/edit ", () => {
      let newPerson;
      let oldPerson;
      before(async () => {
        await historyService.deleteAll();
        oldPerson = {
          result: {
            Name: "Alexandr",
            Family: "Moroz",
            Surname: "Sergeevich",
            Regist: {
              Country: "Україна",
              Adress: "123123",
            },
            Live: {
              Country: "Україна",
              Adress: "123123",
            },
            INN: "2312234312",
            IsResident: true,
          },
        };
        newPerson = await init(oldPerson.result);
      });

      it("it edit Person ", async () => {
        let editPerson = {
          result: {
            Name: "Alexandr2",
            Family: "Moroz2",
            Surname: "Sergeevich2",
            Regist: {
              Country: "Україна",
              Adress: "123123",
            },
            Live: {
              Country: "Україна",
              Adress: "123123",
            },
            INN: "2312234312",
            IsResident: true,
          },
          formDataResultId: newPerson.formDataResultId,
          _id: newPerson._id,
        };
        let res = await chai
          .request(server)
          .put("/api/person/edit")
          .set("Authorization", token)
          .send(editPerson);
        res.should.have.status(200);
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
      });
      it("it edit Person and cheak history ", async () => {
        let editPerson = {
          result: {
            Name: "Alexandr2",
            Family: "Moroz2",
            Surname: "Sergeevich2",
            Regist: {
              Country: "Україна",
              Adress: "123123",
            },
            Live: {
              Country: "Україна",
              Adress: "123123",
            },
            INN: "2312234312",
            IsResident: true,
          },
          formDataResultId: newPerson.formDataResultId,
          _id: newPerson._id,
        };
        let res = await chai
          .request(server)
          .put("/api/person/edit")
          .set("Authorization", token)
          .send(editPerson);

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
        });
      });
      it("it negative test edit Person with mising field", async () => {
        let editPerson = {
          result: {
            // Name: "Alexandr2",
            Family: "Moroz2",
            Surname: "Sergeevich2",
            Regist: {
              Country: "Україна",
              Adress: "123123",
            },
            Live: {
              Country: "Україна",
              Adress: "123123",
            },
            INN: "2312234312",
            IsResident: true,
          },
          formDataResultId: newPerson.formDataResultId,
          _id: newPerson._id,
        };
        let res = await chai
          .request(server)
          .put("/api/person/edit")
          .set("Authorization", token)
          .send(editPerson);

        res.should.have.status(400);
        res.body.should.deep.equal({
          message: "Validation error",
          validation: false,
          success: false,
          error: [
            {
              msg: "Поле Имя порожнє",
              param: "result.Name",
              location: "body",
            },
          ],
        });
      });
      it("it negative test edit Person with wrong Name type ", async () => {
        let editPerson = {
          result: {
            Name: 123123,
            Family: "Moroz2",
            Surname: "Sergeevich2",
            Regist: {
              Country: "Україна",
              Adress: "123123",
            },
            Live: {
              Country: "Україна",
              Adress: "123123",
            },
            INN: "2312234312",
            IsResident: true,
          },
          formDataResultId: newPerson.formDataResultId,
          _id: newPerson._id,
        };
        let res = await chai
          .request(server)
          .put("/api/person/edit")
          .set("Authorization", token)
          .send(editPerson);

        res.should.have.status(400);
        res.body.should.deep.equal({
          message: "Validation error",
          validation: false,
          success: false,
          error: [
            {
              value: 123123,
              msg: "Поле Имя повинно бути строкою",
              param: "result.Name",
              location: "body",
            },
          ],
        });
      });
      it("it negative test edit Person with empty Name ", async () => {
        let editPerson = {
          result: {
            Name: "",
            Family: "Moroz2",
            Surname: "Sergeevich2",
            Regist: {
              Country: "Україна",
              Adress: "123123",
            },
            Live: {
              Country: "Україна",
              Adress: "123123",
            },
            INN: "2312234312",
            IsResident: true,
          },
          formDataResultId: newPerson.formDataResultId,
          _id: newPerson._id,
        };
        let res = await chai
          .request(server)
          .put("/api/person/edit")
          .set("Authorization", token)
          .send(editPerson);

        res.should.have.status(400);
        res.body.should.deep.equal({
          message: "Validation error",
          validation: false,
          success: false,
          error: [
            {
              value: "",
              msg: "Поле Имя повинно містити больше 1 символа",
              param: "result.Name",
              location: "body",
            },
          ],
        });
      });
    });

    describe("Person/search", () => {
      let newPerson;
      let oldPerson;
      before(async () => {
        await historyService.deleteAll();
        oldPerson = {
          result: {
            Name: "Alexandr",
            Family: "Moroz",
            Surname: "Sergeevich",
            Regist: {
              Country: "Україна",
              Adress: "123123",
            },
            Live: {
              Country: "Україна",
              Adress: "123123",
            },
            INN: "2312234312",
            IsResident: true,
          },
        };
        newPerson = await init(oldPerson.result);
      });
      it("it search Person ", async () => {
        let searchPerson = {
          searchText: "Alexandr",
        };
        let res = await chai
          .request(server)
          .get("/api/person/search")
          .set("Authorization", token)
          .query(searchPerson);

        res.should.have.status(200);
        res.body.result.should
          .excluding(["createdAt", "updatedAt", "__v"])
          .deep.equal([
            {
              id: newPerson._id.toString(),
              name: oldPerson.result.Name,
              family: oldPerson.result.Family,
              surname: oldPerson.result.Surname,
              INN: oldPerson.result.INN,
              username: user.username,
              formDataResultId: newPerson.formDataResultId.toString(),
            },
          ]);
      });
      it("it negative test serch Person with empty searchtext ", async () => {
        let searchPerson = {
          searchText: "",
        };
        let res = await chai
          .request(server)
          .get("/api/person/search")
          .set("Authorization", token)
          .query(searchPerson);

        res.should.have.status(400);
        res.body.should.deep.equal({
          message: "Validation error",
          validation: false,
          success: false,
          error: [
            {
              value: "",
              msg: "Поле Поиска повинно містити більше 2 символів",
              param: "searchText",
              location: "query",
            },
          ],
        });
      });
      it("it negative test serch Person with wrong searchtext name ", async () => {
        let searchPerson = {
          searchText1: "1234567",
        };
        let res = await chai
          .request(server)
          .get("/api/person/search")
          .set("Authorization", token)
          .query(searchPerson);

        res.should.have.status(400);
        res.body.should.deep.equal({
          message: "Validation error",
          validation: false,
          success: false,
          error: [
            {
              location: "query",
              msg: "Поле Поиска порожнє",
              param: "searchText",
            },
          ],
        });
      });
      it("it negative test serch Person with 1 charter searchtext lenght  ", async () => {
        let searchPerson = {
          searchText: "1",
        };
        let res = await chai
          .request(server)
          .get("/api/person/search")
          .set("Authorization", token)
          .query(searchPerson);

        res.should.have.status(400);
        res.body.should.deep.equal({
          message: "Validation error",
          validation: false,
          success: false,
          error: [
            {
              value: "1",
              msg: "Поле Поиска повинно містити більше 2 символів",
              param: "searchText",
              location: "query",
            },
          ],
        });
      });
    });

    describe("Person/getById", () => {
      let newPerson;
      let oldPerson;
      before(async () => {
        await historyService.deleteAll();
        oldPerson = {
          result: {
            Name: "Alexandr",
            Family: "Moroz",
            Surname: "Sergeevich",
            Regist: {
              Country: "Україна",
              Adress: "123123",
            },
            Live: {
              Country: "Україна",
              Adress: "123123",
            },
            INN: "2312234312",
            IsResident: true,
          },
        };
        newPerson = await init(oldPerson.result);
      });
      it("it get Person form data by id", async () => {
        let res = await chai
          .request(server)
          .get("/api/person/form-data")
          .set("Authorization", token)
          .query({ id: newPerson.formDataResultId.toString() });

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
            Regist: oldPerson.result.Regist,
            Live: oldPerson.result.Live,
            IsResident: oldPerson.result.IsResident,
            INN: oldPerson.result.INN,
          });
      });
      it("it negative test get Person form data by id with wrong id", async () => {
        let res = await chai
          .request(server)
          .get("/api/person/form-data")
          .set("Authorization", token)
          .query({ id: "60a6240e9874e015b03b25f2" }); //wrong id

        res.should.have.status(400);
        res.body.should.have.property("error").deep.equal([
          {
            value: "60a6240e9874e015b03b25f2",
            msg: "Невірний id",
            param: "id",
            location: "query",
          },
        ]);
      });
      it("it negative test get Person form data by id with empty id", async () => {
        let res = await chai
          .request(server)
          .get("/api/person/form-data")
          .set("Authorization", token)
          .query({ id: "" }); //wrong id

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
      });
    });
    describe("Person/file", async () => {
      let newPerson;
      let oldPerson;
      before(async () => {
        await helperService.deleteAll();
        await helperService.create(translate.name, translate.result);
        oldPerson = {
          result: {
            Live: {
              Country: "Україна",
              Adress: "123123123",
            },
            Name: "Олександр",
            Family: "Олександров",
            Surname: "Олександрович",
            Birthday: "2000-01-01",
            IDDocument: "паспорт громадянина України",
            IDNumber: "123456",
            IDGovAgency: "Київський РВ УМВС",
            IDDateRelise: "2016-02-01",
            UNIR: "12345678910",
            ClienFinancialStand: [
              { IsFinancialStandGood: true, CreateDate: "2021-07-06" },
            ],
          },
        };
        await historyService.deleteAll();
        newPerson = await init(oldPerson.result);
      });
      it("it get Person buf of file  ", async () => {
        let res = await chai
          .request(server)
          .get("/api/person/file")
          .set("Authorization", token)
          .query({ id: newPerson._id.toString() });
        const wb = XLSX.read(res.body.result, { type: "base64" });
        let shoudEquals = {
          "!ref": "A1:D14",
          A1: {
            t: "s",
            v: "Анкета Фізичної особи Не резидента",
            h: "Анкета Фізичної особи Не резидента",
            w: "Анкета Фізичної особи Не резидента",
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
            v: "23/02/2022, 12:36:15",
            h: "23/02/2022, 12:36:15",
            w: "23/02/2022, 12:36:15",
          },
          A3: { t: "s", v: "Прізвище", h: "Прізвище", w: "Прізвище" },
          B3: { t: "s", v: "Олександров", h: "Олександров", w: "Олександров" },
          A4: { t: "s", v: "Ім'я", h: "Ім&apos;я", w: "Ім'я" },
          B4: { t: "s", v: "Олександр", h: "Олександр", w: "Олександр" },
          A5: { t: "s", v: "По батькові", h: "По батькові", w: "По батькові" },
          B5: {
            t: "s",
            v: "Олександрович",
            h: "Олександрович",
            w: "Олександрович",
          },
          A6: {
            t: "s",
            v: "Унікальний номер запису в реєстрі",
            h: "Унікальний номер запису в реєстрі",
            w: "Унікальний номер запису в реєстрі",
          },
          B6: { t: "s", v: "12345678910", h: "12345678910", w: "12345678910" },
          A7: {
            t: "s",
            v: "Дата нарождения",
            h: "Дата нарождения",
            w: "Дата нарождения",
          },
          B7: { t: "s", v: "2000-01-01", h: "2000-01-01", w: "2000-01-01" },
          A8: {
            t: "s",
            v: "Документ що засвідчує особу",
            h: "Документ що засвідчує особу",
            w: "Документ що засвідчує особу",
          },
          B8: {
            t: "s",
            v: "паспорт громадянина України",
            h: "паспорт громадянина України",
            w: "паспорт громадянина України",
          },
          A9: { t: "s", v: "Номер", h: "Номер", w: "Номер" },
          B9: { t: "s", v: "123456", h: "123456", w: "123456" },
          A10: {
            t: "s",
            v: "Орган що видав документ",
            h: "Орган що видав документ",
            w: "Орган що видав документ",
          },
          B10: {
            t: "s",
            v: "Київський РВ УМВС",
            h: "Київський РВ УМВС",
            w: "Київський РВ УМВС",
          },
          A11: {
            t: "s",
            v: "Дата видачі документу",
            h: "Дата видачі документу",
            w: "Дата видачі документу",
          },
          B11: { t: "s", v: "2016-02-01", h: "2016-02-01", w: "2016-02-01" },
          A12: {
            t: "s",
            v: "Місце перебування",
            h: "Місце перебування",
            w: "Місце перебування",
          },
          B12: { t: "s", v: "Країна", h: "Країна", w: "Країна" },
          C12: { t: "s", v: "Україна", h: "Україна", w: "Україна" },
          B13: { t: "s", v: "Адреса", h: "Адреса", w: "Адреса" },
          C13: { t: "s", v: "123123123", h: "123123123", w: "123123123" },
          A14: {
            t: "s",
            v: "Фінансовий стан ",
            h: "Фінансовий стан ",
            w: "Фінансовий стан ",
          },
          B14: {
            t: "s",
            v: "Дата розрахунку",
            h: "Дата розрахунку",
            w: "Дата розрахунку",
          },
          C14: { t: "s", v: "2021-07-06", h: "2021-07-06", w: "2021-07-06" },
        };
        wb.Sheets["Анкета"].should.excluding(["D2"]).deep.equal(shoudEquals);
        res.should.have.status(200);
      });
      it("it negative test get Person buf of file with wrong id  ", async () => {
        let res = await chai
          .request(server)
          .get("/api/person/file")
          .set("Authorization", token)
          .query({ id: "60a6240e9874e015b03b25f2" }); //wrong id

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
      it("it negative test get Person buf of file with empty id  ", async () => {
        let res = await chai
          .request(server)
          .get("/api/person/file")
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
module.exports = test;
