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

// const { testConfig } = require("../config/index");
// let server = require("../server")(testConfig);

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

let test = (server) => {
  describe("test Person api", () => {
    before(async () => {
      let res = await chai.request(server).post("/api/user/login").send({
        username: user.username,
        password: user.password,
      });
      token = res.body.token;
    });
    describe("Person/create ", () => {
      beforeEach(async function () {
        await Person.deleteMany({});
        await PersonFormData.deleteMany({});
      });

      it("it create new Person ", async () => {
        const CreatePerson = {
          result: {
            Name: "Alexandr",
            Family: "Moroz",
            Surname: "Sergeevich",
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
              msg: "Поле Резидент порожне",
              param: "result.IsResident",
              location: "body",
            },
            {
              msg: "Поле Имя порожне",
              param: "result.Name",
              location: "body",
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
              msg: "Поле Резидент порожне",
              param: "result.IsResident",
              location: "body",
            },
            {
              msg: "Поле Имя порожне",
              param: "result.Name",
              location: "body",
            },
            {
              msg: "Поле Фамилия порожне",
              param: "result.Family",
              location: "body",
            },
          ],
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

      it("it edit Person ", async () => {
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
            DateOfFirstSigned: "12.12.2021",
            INN: "2312234312",
          },
          formDataResultId: newPersonFormData._id,
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
          DateOfFirstSigned: [editPerson.result.DateOfFirstSigned],
        });
      });
      it("it negative test edit Person with mising field", async () => {
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
              msg: "Поле Имя порожне",
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
            DateOfFirstSigned: "12.12.2021",
            INN: "2312234312",
          },
          formDataResultId: newPersonFormData._id,
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
            DateOfFirstSigned: "12.12.2021",
            INN: "2312234312",
          },
          formDataResultId: newPersonFormData._id,
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
              _id: newPerson._id.toString(),
              name: oldPerson.result.Name,
              family: oldPerson.result.Family,
              surname: oldPerson.result.Surname,
              INN: oldPerson.result.INN,
              username: user.username,
              formDataResultId: newPersonFormData._id.toString(),
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
              msg: "Поле Поиска порожне",
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
        res.body.should.have.property("message").eql("Validation error");
        res.body.should.have.property("validation").eql(false);
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
      let newPersonFormData;
      let oldPerson;
      before(async () => {
        await History.deleteMany({});
        await PersonFormData.deleteMany({});
        await Person.deleteMany({});
        await Helper.deleteMany({});
        await new Helper({
          name: translate.name,
          content: translate.content,
        }).save();
        oldPerson = {
          result: {
            Live: {
              Country: "Україна",
              State: "-",
              District: "-",
              Adress: "м.Київ, вул. Бандери Степана, буд. 1, к.1, кв.1",
              IsEqualsToLive: true,
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
      it("it get Person buf of file  ", async () => {
        let res = await chai
          .request(server)
          .get("/api/person/file")
          .set("Authorization", token)
          .query({ id: newPerson._id.toString() });
        // const wb = XLSX.read(res.body.result, { type: "base64" });
        // console.log(wb.Sheets["Анкета"]);
        // let obj = {
        //   '!ref': 'A1:D16',
        //   A1: {
        //     t: 's',
        //     v: 'Анкета фізичной особи Не резидента',
        //     h: 'Анкета фізичной особи Не резидента',
        //     w: 'Анкета фізичной особи Не резидента'
        //   },
        //   A2: {
        //     t: 's',
        //     v: 'Створенно користувачем',
        //     h: 'Створенно користувачем',
        //     w: 'Створенно користувачем'
        //   },
        //   B2: {
        //     t: 's',
        //     v: 'moroz1 alexandr2 sergeevich1',
        //     h: 'moroz1 alexandr2 sergeevich1',
        //     w: 'moroz1 alexandr2 sergeevich1'
        //   },
        //   C2: {
        //     t: 's',
        //     v: 'Дата створення:',
        //     h: 'Дата створення:',
        //     w: 'Дата створення:'
        //   },
        //   D2: {
        //     t: 's',
        //     v: '03/12/2021, 16:34:04',
        //     h: '03/12/2021, 16:34:04',
        //     w: '03/12/2021, 16:34:04'
        //   },
        //   A3: { t: 's', v: 'Прізвище', h: 'Прізвище', w: 'Прізвище' },
        //   B3: { t: 's', v: 'Олександров', h: 'Олександров', w: 'Олександров' },
        //   A4: { t: 's', v: "Ім'я", h: 'Ім&apos;я', w: "Ім'я" },
        //   B4: { t: 's', v: 'Олександр', h: 'Олександр', w: 'Олександр' },
        //   A5: { t: 's', v: 'По батькові', h: 'По батькові', w: 'По батькові' },
        //   B5: {
        //     t: 's',
        //     v: 'Олександрович',
        //     h: 'Олександрович',
        //     w: 'Олександрович'
        //   },
        //   A6: {
        //     t: 's',
        //     v: 'Унікальний номер запису в реєстрі',
        //     h: 'Унікальний номер запису в реєстрі',
        //     w: 'Унікальний номер запису в реєстрі'
        //   },
        //   B6: { t: 's', v: '12345678910', h: '12345678910', w: '12345678910' },
        //   A7: {
        //     t: 's',
        //     v: 'Дата нарождения',
        //     h: 'Дата нарождения',
        //     w: 'Дата нарождения'
        //   },
        //   B7: { t: 's', v: '2000-01-01', h: '2000-01-01', w: '2000-01-01' },
        //   A8: {
        //     t: 's',
        //     v: 'Документ що засвідчує особу',
        //     h: 'Документ що засвідчує особу',
        //     w: 'Документ що засвідчує особу'
        //   },
        //   B8: {
        //     t: 's',
        //     v: 'паспорт громадянина України',
        //     h: 'паспорт громадянина України',
        //     w: 'паспорт громадянина України'
        //   },
        //   A9: { t: 's', v: 'Номер', h: 'Номер', w: 'Номер' },
        //   B9: { t: 's', v: '123456', h: '123456', w: '123456' },
        //   A10: {
        //     t: 's',
        //     v: 'Орган що видав документ',
        //     h: 'Орган що видав документ',
        //     w: 'Орган що видав документ'
        //   },
        //   B10: {
        //     t: 's',
        //     v: 'Київський РВ УМВС',
        //     h: 'Київський РВ УМВС',
        //     w: 'Київський РВ УМВС'
        //   },
        //   A11: {
        //     t: 's',
        //     v: 'Дата видачі документу',
        //     h: 'Дата видачі документу',
        //     w: 'Дата видачі документу'
        //   },
        //   B11: { t: 's', v: '2016-02-01', h: '2016-02-01', w: '2016-02-01' },
        //   A12: {
        //     t: 's',
        //     v: 'Місце перебування',
        //     h: 'Місце перебування',
        //     w: 'Місце перебування'
        //   },
        //   B12: { t: 's', v: 'Країна', h: 'Країна', w: 'Країна' },
        //   C12: { t: 's', v: 'Україна', h: 'Україна', w: 'Україна' },
        //   B13: {
        //     t: 's',
        //     v: 'Область (за наявності)',
        //     h: 'Область (за наявності)',
        //     w: 'Область (за наявності)'
        //   },
        //   C13: { t: 's', v: '-', h: '-', w: '-' },
        //   B14: {
        //     t: 's',
        //     v: 'Район (за наявності)',
        //     h: 'Район (за наявності)',
        //     w: 'Район (за наявності)'
        //   },
        //   C14: { t: 's', v: '-', h: '-', w: '-' },
        //   B15: { t: 's', v: 'Адреса', h: 'Адреса', w: 'Адреса' },
        //   C15: {
        //     t: 's',
        //     v: 'м.Київ, вул. Бандери Степана, буд. 1, к.1, кв.1',
        //     h: 'м.Київ, вул. Бандери Степана, буд. 1, к.1, кв.1',
        //     w: 'м.Київ, вул. Бандери Степана, буд. 1, к.1, кв.1'
        //   },
        //   A16: {
        //     t: 's',
        //     v: 'Фінансовий стан ',
        //     h: 'Фінансовий стан ',
        //     w: 'Фінансовий стан '
        //   },
        //   B16: {
        //     t: 's',
        //     v: 'Дата розрахунку',
        //     h: 'Дата розрахунку',
        //     w: 'Дата розрахунку'
        //   },
        //   C16: { t: 's', v: '2021-07-06', h: '2021-07-06', w: '2021-07-06' }
        // };
        // wb.Sheets["Анкета"].should
        //   .excluding(["D2"])
        //   .deep.equal(obj["Анкета"]);
        res.should.have.status(200);
      });
      // it("it get Person buf of file  ", async () => {
      //   let res = await chai
      //     .request(server)
      //     .get("/api/person/file")
      //     .set("Authorization", token)
      //     .query({ id: newPerson._id.toString() })
      //
      //       const wb = XLSX.read(res.body.result, { type: "base64" });
      //       XLSX.writeFile(wb, "out.xlsx");
      // });
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
