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
const { testConfig } = require("../config/index");
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

//let test = () => {
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
          IsResident: true,
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
          res.body.should.deep.equal({
            message: "Validation error",
            validation: false,
            success: false,
            error: [
              {
                location: "query",
                msg: 'Поле Поиска порожне',
                param: "searchText",
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
          res.body.should.deep.equal({
            message: "Validation error",
            validation: false,
            success: false,
            error: [
              {
                value: "1",
                msg: 'Поле Поиска повинно містити більше 2 символів',
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
              msg: "Невірний id",
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
          Live: {
            Country: "Україна",
            State: "-",
            District: "-",
            Adress: "м.Київ, вул. Бандери Степана, буд. 1, к.1, кв.1",
            IsEqualsToLive: true,
          },
          Family: "Олександров",
          Surname: "Олександрович",
          Birthday: "2000-01-01",
          IDDocument: "паспорт громадянина України",
          IDNumber: "123456",
          IDGovAgency: "Київський РВ УМВС",
          IDDateRelise: "2016-02-01",
          UNIR: "12345678910",
          Regist: {
            Country: "Україна",
            State: "-",
            District: "-",
            Adress: "м.Київ, вул. Бандери Степана, буд. 1, к.1, кв.1",
            IsEqualsToLive: true,
          },
          PEP: {
            Type: "Політично значуща особа !",
            Category: "Депутат",
            Name: "Олександров",
            Family: "Олександр",
            Surname: "Олександрович",
            DateOfNown: "2021-07-07",
            DateOfBossAgree: "2021-07-08",
            IsTerrorist: false,
            IsSanction: true,
          },
          Property: [
            {
              PropertyType: [
                "транспортні засоби, що належать державній реєстрації",
              ],
              PropertyDescription:
                "автомобіль марки TOYOTA, модель LEAND CRUIZER, 2021 року випуску",
            },
            {
              PropertyType: ["нерухомість"],
              PropertyDescription:
                "офііс площею 100 кв.м. за адресом - м.Київ, проспект Небесної Сотні, буд. 100, оф. 501",
            },
            {
              PropertyType: ["грошові кошти на рахунку в банках"],
              PropertyDescription: "100 000,00 грн. на депозитному рахунку",
            },
          ],
          BankAccount: [
            {
              BankName: "ПриватБанк",
              BankCode: "328704",
              AccountCode: "UA101010101010101010101010101",
            },
            {
              BankName: "УкрСибБанк",
              BankCode: "704328",
              AccountCode: "UA101010101010101010101010101",
            },
          ],
          CheckList: {
            HasNotIncome: false,
            ClientProfessionIsDifferent: false,
            HasQuestionFromFinmon: false,
            HasQuestionFromPolice: true,
            HasBadReputation: false,
            IsTerrorist: true,
            ClientUseProduct: 3,
          },
          Operations: [
            { Operation: "10500 - зняття готівки", CreateDate: "1993-10-09" },
          ],
          Representative: [
            {
              Name: "Іванов",
              Family: "Іван",
              Surname: "Іванович",
              INN: 1231234321,
              Birthday: "1999-07-01",
              IDDocument: "паспорт громадянина України для виїзду за кордон",
              IDSeries: "ААВС",
              IDNumber: "12345678910",
              Regist: {
                Country: "Україна",
                State: "-",
                District: "-",
                Adress:
                  "м.Бориспіль, вул. Академіка Вернадського, буд. 1, кв. 1",
              },
              Citizen: "Україна",
              IDGovAgency: "Київський РВ УМВС",
              IDDateRelise: "2015-10-01",
              UNIR: "12345678910",
              ConfirmAuthorityDocument: "довіреність",
              ConfirmAuthoritySerias: "АА",
              ConfirmAuthorityNumber: "12345678910",
              ConfirmAuthorityDate: "2021-06-01",
              IsTerrorist: true,
            },
          ],
          ClienFinancialStand: [
            { IsFinancialStandGood: true, CreateDate: "2021-07-06" },
          ],
          IDSeries: "КА",
          ClienReputations: [
            { CreateDate: "2021-07-06", IsReputationGood: true },
          ],
          DateOfFirstSigned: "2021-07-05",
          DateOfFirstBissnesContact: "2021-07-09",
          IdentificationЕype: "Особиста фізична присутність",
          PlaceOfBirth: "Україна, м.Київ",
          FOP: {
            GovRegDoc: "виписка",
            GovRegDocSerias: "КА",
            GovRegDocNumber: "123456",
            ProfessionType: "приватний нотаріус",
            RegistrationNumber: "1234567891011121314151617",
            GovRegDocDateRelise: "2020-03-01",
            ClientAge: "2 дней 4 месяцев 1 лет ",
            GovRegDocDepartment: "Київська міська рада",
            BusinessType: [
              "64.19 Інші види грошового посередництва (основний);",
              "64.91 Фінансовий лізинг;",
              "64.92 Інші види кредитування;",
            ],
          },
          ServiceType: [
            "Надання позик",
            "Позика, в тому числі на умовах фінансового кредиту",
          ],
          Citizen: "Україна",
          IsResident: true,
          ClienRisk: [{ Risk: "високий", OnCreateDate: "2021-07-06" }],
          INN: "1234567890",
          Telephone: "(067) 123-4567",
          Email: "name@gmail",
          Licenses:
            "Ліцензія на провадження діяльності нотаріуса за №100, видана Міністерством юстиції 01.06.2021",
          MounthIncome: 100000,
          EmployersNum: 3,
          AdditionalSteps: "Здійснений виїзд на місце ведення діяльності",
          Name: "вадим2",
          EmploymentType: [
            "найманий працівник",
            "студент/пенсіонер",
            "безробітний",
            "власник бізнеса",
          ],
          EmploymentTypeDescribe: "фываываывафывфывфыв",
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
          const wb = XLSX.read(res.body.result, { type: "base64" });
          let obj = {
            Анкета: { '!ref': 'A1:D99',
            A1: 
             { h: 'Анкета фізичной особи Резидента',
               t: 's',
               v: 'Анкета фізичной особи Резидента',
               w: 'Анкета фізичной особи Резидента' },
            A10: 
             { h: 'Унікальний номер запису в реєстрі',
               t: 's',
               v: 'Унікальний номер запису в реєстрі',
               w: 'Унікальний номер запису в реєстрі' },
            A11: { h: 'ІНПП', t: 's', v: 'ІНПП', w: 'ІНПП' },
            A12: 
             { h: 'Дата нарождения',
               t: 's',
               v: 'Дата нарождения',
               w: 'Дата нарождения' },
            A13: 
             { h: 'Місце нарождения',
               t: 's',
               v: 'Місце нарождения',
               w: 'Місце нарождения' },
            A14: 
             { h: 'Документ що засвідчує особу',
               t: 's',
               v: 'Документ що засвідчує особу',
               w: 'Документ що засвідчує особу' },
            A15: { h: 'Серія', t: 's', v: 'Серія', w: 'Серія' },
            A16: { h: 'Номер', t: 's', v: 'Номер', w: 'Номер' },
            A17: 
             { h: 'Орган що видав документ',
               t: 's',
               v: 'Орган що видав документ',
               w: 'Орган що видав документ' },
            A18: 
             { h: 'Дата видачі документу',
               t: 's',
               v: 'Дата видачі документу',
               w: 'Дата видачі документу' },
            A19: 
             { h: 'Місце проживання',
               t: 's',
               v: 'Місце проживання',
               w: 'Місце проживання' },
            A2: 
             { h: 'Створенно користувачем',
               t: 's',
               v: 'Створенно користувачем',
               w: 'Створенно користувачем' },
            A23: 
             { h: 'Місце перебування',
               t: 's',
               v: 'Місце перебування',
               w: 'Місце перебування' },
            A27: 
             { h: 'Громадянство',
               t: 's',
               v: 'Громадянство',
               w: 'Громадянство' },
            A28: { h: 'Чи резидент', t: 's', v: 'Чи резидент', w: 'Чи резидент' },
            A29: { h: 'ФОП:', t: 's', v: 'ФОП:', w: 'ФОП:' },
            A3: 
             { h: 'Дата первинного заповнення анкети',
               t: 's',
               v: 'Дата первинного заповнення анкети',
               w: 'Дата первинного заповнення анкети' },
            A39: { h: 'PEP:', t: 's', v: 'PEP:', w: 'PEP:' },
            A4: 
             { h: 'Дата встановлення ділових відносин / здійснення першої разової фінансової операції на значну суму',
               t: 's',
               v: 'Дата встановлення ділових відносин / здійснення першої разової фінансової операції на значну суму',
               w: 'Дата встановлення ділових відносин / здійснення першої разової фінансової операції на значну суму' },
            A47: 
             { h: 'Представник клієнта',
               t: 's',
               v: 'Представник клієнта',
               w: 'Представник клієнта' },
            A5: 
             { h: 'Види послуг, якими користується клієнт',
               t: 's',
               v: 'Види послуг, якими користується клієнт',
               w: 'Види послуг, якими користується клієнт' },
            A65: 
             { h: 'Вид (види) зайнятості:',
               t: 's',
               v: 'Вид (види) зайнятості:',
               w: 'Вид (види) зайнятості:' },
            A69: 
             { h: 'Ліцензії (дозволи) на право здійснення певних операцій (діяльності) (найменування, серії, номери, ким видані, термін дії)',
               t: 's',
               v: 'Ліцензії (дозволи) на право здійснення певних операцій (діяльності) (найменування, серії, номери, ким видані, термін дії)',
               w: 'Ліцензії (дозволи) на право здійснення певних операцій (діяльності) (найменування, серії, номери, ким видані, термін дії)' },
            A7: { h: 'Прізвище', t: 's', v: 'Прізвище', w: 'Прізвище' },
            A70: 
             { h: 'Рахунки клієнта, відкриті в банках (найменування банку, код банку, номер рахунку)',
               t: 's',
               v: 'Рахунки клієнта, відкриті в банках (найменування банку, код банку, номер рахунку)',
               w: 'Рахунки клієнта, відкриті в банках (найменування банку, код банку, номер рахунку)' },
            A76: 
             { h: 'Кількість найманих працівників, чол.',
               t: 's',
               v: 'Кількість найманих працівників, чол.',
               w: 'Кількість найманих працівників, чол.' },
            A77: 
             { h: 'Середньомісячна виручка (дохід), грн.',
               t: 's',
               v: 'Середньомісячна виручка (дохід), грн.',
               w: 'Середньомісячна виручка (дохід), грн.' },
            A78: 
             { h: 'Майно (активи) клієнта у власності/оренді/суборенді',
               t: 's',
               v: 'Майно (активи) клієнта у власності/оренді/суборенді',
               w: 'Майно (активи) клієнта у власності/оренді/суборенді' },
            A8: { h: 'Ім&apos;я', t: 's', v: 'Ім\'я', w: 'Ім\'я' },
            A84: { h: 'Телефон', t: 's', v: 'Телефон', w: 'Телефон' },
            A85: { h: 'Email', t: 's', v: 'Email', w: 'Email' },
            A86: { h: 'Чек лист', t: 's', v: 'Чек лист', w: 'Чек лист' },
            A9: { h: 'По батькові', t: 's', v: 'По батькові', w: 'По батькові' },
            A93: 
             { h: 'Додаткові заходи НПК (зокрема актуалізації даних про клієнта, ПЗНП результатів моніторингу фінансових операцій)',
               t: 's',
               v: 'Додаткові заходи НПК (зокрема актуалізації даних про клієнта, ПЗНП результатів моніторингу фінансових операцій)',
               w: 'Додаткові заходи НПК (зокрема актуалізації даних про клієнта, ПЗНП результатів моніторингу фінансових операцій)' },
            A94: 
             { h: 'Ознаки (коди) фінансових операцій клієнта, що підлягають фінансовому моніторингу, за останні 6 місяців',
               t: 's',
               v: 'Ознаки (коди) фінансових операцій клієнта, що підлягають фінансовому моніторингу, за останні 6 місяців',
               w: 'Ознаки (коди) фінансових операцій клієнта, що підлягають фінансовому моніторингу, за останні 6 місяців' },
            A96: 
             { h: 'Репутація клієнта',
               t: 's',
               v: 'Репутація клієнта',
               w: 'Репутація клієнта' },
            A97: 
             { h: 'Фінансовий стан ',
               t: 's',
               v: 'Фінансовий стан ',
               w: 'Фінансовий стан ' },
            A98: 
             { h: 'Ризик клієнта',
               t: 's',
               v: 'Ризик клієнта',
               w: 'Ризик клієнта' },
            B10: { h: '12345678910', t: 's', v: '12345678910', w: '12345678910' },
            B11: { h: '1234567890', t: 's', v: '1234567890', w: '1234567890' },
            B12: { h: '2000-01-01', t: 's', v: '2000-01-01', w: '2000-01-01' },
            B13: 
             { h: 'Україна, м.Київ',
               t: 's',
               v: 'Україна, м.Київ',
               w: 'Україна, м.Київ' },
            B14: 
             { h: 'паспорт громадянина України',
               t: 's',
               v: 'паспорт громадянина України',
               w: 'паспорт громадянина України' },
            B15: { h: 'КА', t: 's', v: 'КА', w: 'КА' },
            B16: { h: '123456', t: 's', v: '123456', w: '123456' },
            B17: 
             { h: 'Київський РВ УМВС',
               t: 's',
               v: 'Київський РВ УМВС',
               w: 'Київський РВ УМВС' },
            B18: { h: '2016-02-01', t: 's', v: '2016-02-01', w: '2016-02-01' },
            B19: { h: 'Країна', t: 's', v: 'Країна', w: 'Країна' },
            B2: 
             { h: 'moroz1 alexandr1 sergeevich1',
               t: 's',
               v: 'moroz1 alexandr1 sergeevich1',
               w: 'moroz1 alexandr1 sergeevich1' },
            B20: 
             { h: 'Область (за наявності)',
               t: 's',
               v: 'Область (за наявності)',
               w: 'Область (за наявності)' },
            B21: 
             { h: 'Район (за наявності)',
               t: 's',
               v: 'Район (за наявності)',
               w: 'Район (за наявності)' },
            B22: { h: 'Адреса', t: 's', v: 'Адреса', w: 'Адреса' },
            B23: { h: 'Країна', t: 's', v: 'Країна', w: 'Країна' },
            B24: 
             { h: 'Область (за наявності)',
               t: 's',
               v: 'Область (за наявності)',
               w: 'Область (за наявності)' },
            B25: 
             { h: 'Район (за наявності)',
               t: 's',
               v: 'Район (за наявності)',
               w: 'Район (за наявності)' },
            B26: { h: 'Адреса', t: 's', v: 'Адреса', w: 'Адреса' },
            B27: { h: 'Україна', t: 's', v: 'Україна', w: 'Україна' },
            B28: { h: 'Так', t: 's', v: 'Так', w: 'Так' },
            B29: 
             { h: 'Документ, підтверджуючий державну реєстрацію',
               t: 's',
               v: 'Документ, підтверджуючий державну реєстрацію',
               w: 'Документ, підтверджуючий державну реєстрацію' },
            B3: { h: '2021-07-05', t: 's', v: '2021-07-05', w: '2021-07-05' },
            B30: 
             { h: 'Cерія документу',
               t: 's',
               v: 'Cерія документу',
               w: 'Cерія документу' },
            B31: 
             { h: 'Номер документу',
               t: 's',
               v: 'Номер документу',
               w: 'Номер документу' },
            B32: 
             { h: 'Вид підприємницької діяльності',
               t: 's',
               v: 'Вид підприємницької діяльності',
               w: 'Вид підприємницької діяльності' },
            B35: 
             { h: 'Вид незалежної професійної діяльності',
               t: 's',
               v: 'Вид незалежної професійної діяльності',
               w: 'Вид незалежної професійної діяльності' },
            B36: 
             { h: 'Дата державної реєстрації',
               t: 's',
               v: 'Дата державної реєстрації',
               w: 'Дата державної реєстрації' },
            B37: 
             { h: 'Номер запису про державну реєстрацію',
               t: 's',
               v: 'Номер запису про державну реєстрацію',
               w: 'Номер запису про державну реєстрацію' },
            B38: 
             { h: 'Орган державної реєстрації',
               t: 's',
               v: 'Орган державної реєстрації',
               w: 'Орган державної реєстрації' },
            B39: 
             { h: 'Належність до PEP',
               t: 's',
               v: 'Належність до PEP',
               w: 'Належність до PEP' },
            B4: { h: '2021-07-09', t: 's', v: '2021-07-09', w: '2021-07-09' },
            B40: 
             { h: 'Категорія посад політично значущої особи',
               t: 's',
               v: 'Категорія посад політично значущої особи',
               w: 'Категорія посад політично значущої особи' },
            B41: { h: 'Ім&apos;я', t: 's', v: 'Ім\'я', w: 'Ім\'я' },
            B42: { h: 'Прізвище', t: 's', v: 'Прізвище', w: 'Прізвище' },
            B43: { h: 'По батькові', t: 's', v: 'По батькові', w: 'По батькові' },
            B44: 
             { h: 'Дата виявлення відповідного факту',
               t: 's',
               v: 'Дата виявлення відповідного факту',
               w: 'Дата виявлення відповідного факту' },
            B45: 
             { h: 'Дата отримання дозволу керівника установи на встановлення/продовження ділових (договірних) відносин',
               t: 's',
               v: 'Дата отримання дозволу керівника установи на встановлення/продовження ділових (договірних) відносин',
               w: 'Дата отримання дозволу керівника установи на встановлення/продовження ділових (договірних) відносин' },
            B46: 
             { h: 'Належність до осіб, щодо яких застосовано санкції України',
               t: 's',
               v: 'Належність до осіб, щодо яких застосовано санкції України',
               w: 'Належність до осіб, щодо яких застосовано санкції України' },
            B47: { h: 'Прізвище', t: 's', v: 'Прізвище', w: 'Прізвище' },
            B48: { h: 'Ім&apos;я', t: 's', v: 'Ім\'я', w: 'Ім\'я' },
            B49: { h: 'По батькові', t: 's', v: 'По батькові', w: 'По батькові' },
            B5: 
             { h: 'Надання позик',
               t: 's',
               v: 'Надання позик',
               w: 'Надання позик' },
            B50: 
             { h: 'Унікальний номер запису в реєстрі',
               t: 's',
               v: 'Унікальний номер запису в реєстрі',
               w: 'Унікальний номер запису в реєстрі' },
            B51: { h: 'ІНПП', t: 's', v: 'ІНПП', w: 'ІНПП' },
            B52: 
             { h: 'Дата нарождения',
               t: 's',
               v: 'Дата нарождения',
               w: 'Дата нарождения' },
            B53: 
             { h: 'Документ що засвідчує особу',
               t: 's',
               v: 'Документ що засвідчує особу',
               w: 'Документ що засвідчує особу' },
            B54: { h: 'Серія', t: 's', v: 'Серія', w: 'Серія' },
            B55: { h: 'Номер', t: 's', v: 'Номер', w: 'Номер' },
            B56: 
             { h: 'Орган що видав документ',
               t: 's',
               v: 'Орган що видав документ',
               w: 'Орган що видав документ' },
            B57: 
             { h: 'Дата видачі документу',
               t: 's',
               v: 'Дата видачі документу',
               w: 'Дата видачі документу' },
            B58: 
             { h: 'Місце проживання',
               t: 's',
               v: 'Місце проживання',
               w: 'Місце проживання' },
            B6: 
             { h: 'Позика, в тому числі на умовах фінансового кредиту',
               t: 's',
               v: 'Позика, в тому числі на умовах фінансового кредиту',
               w: 'Позика, в тому числі на умовах фінансового кредиту' },
            B62: 
             { h: 'Громадянство',
               t: 's',
               v: 'Громадянство',
               w: 'Громадянство' },
            B63: 
             { h: 'Документ що підтверджує повноваження особи',
               t: 's',
               v: 'Документ що підтверджує повноваження особи',
               w: 'Документ що підтверджує повноваження особи' },
            B64: 
             { h: 'Належність до осіб, пов&apos;язаних із здійсненням терористичної діяльності або щодо яких застосовано міжнародні санкції',
               t: 's',
               v: 'Належність до осіб, пов\'язаних із здійсненням терористичної діяльності або щодо яких застосовано міжнародні санкції',
               w: 'Належність до осіб, пов\'язаних із здійсненням терористичної діяльності або щодо яких застосовано міжнародні санкції' },
            B65: 
             { h: 'найманий працівник',
               t: 's',
               v: 'найманий працівник',
               w: 'найманий працівник' },
            B66: 
             { h: 'студент/пенсіонер',
               t: 's',
               v: 'студент/пенсіонер',
               w: 'студент/пенсіонер' },
            B67: { h: 'безробітний', t: 's', v: 'безробітний', w: 'безробітний' },
            B68: 
             { h: 'власник бізнеса',
               t: 's',
               v: 'власник бізнеса',
               w: 'власник бізнеса' },
            B69: 
             { h: 'Ліцензія на провадження діяльності нотаріуса за №100, видана Міністерством юстиції 01.06.2021',
               t: 's',
               v: 'Ліцензія на провадження діяльності нотаріуса за №100, видана Міністерством юстиції 01.06.2021',
               w: 'Ліцензія на провадження діяльності нотаріуса за №100, видана Міністерством юстиції 01.06.2021' },
            B7: { h: 'Олександров', t: 's', v: 'Олександров', w: 'Олександров' },
            B70: 
             { h: 'Найменування банку',
               t: 's',
               v: 'Найменування банку',
               w: 'Найменування банку' },
            B71: { h: 'Код банку', t: 's', v: 'Код банку', w: 'Код банку' },
            B72: 
             { h: 'Номер рахунку',
               t: 's',
               v: 'Номер рахунку',
               w: 'Номер рахунку' },
            B73: 
             { h: 'Найменування банку',
               t: 's',
               v: 'Найменування банку',
               w: 'Найменування банку' },
            B74: { h: 'Код банку', t: 's', v: 'Код банку', w: 'Код банку' },
            B75: 
             { h: 'Номер рахунку',
               t: 's',
               v: 'Номер рахунку',
               w: 'Номер рахунку' },
            B76: { t: 'n', v: 3, w: '3' },
            B77: { t: 'n', v: 100000, w: '100000' },
            B78: { h: 'Тип майна', t: 's', v: 'Тип майна', w: 'Тип майна' },
            B79: { h: 'Опис майна', t: 's', v: 'Опис майна', w: 'Опис майна' },
            B8: { h: 'вадим2', t: 's', v: 'вадим2', w: 'вадим2' },
            B80: { h: 'Тип майна', t: 's', v: 'Тип майна', w: 'Тип майна' },
            B81: { h: 'Опис майна', t: 's', v: 'Опис майна', w: 'Опис майна' },
            B82: { h: 'Тип майна', t: 's', v: 'Тип майна', w: 'Тип майна' },
            B83: { h: 'Опис майна', t: 's', v: 'Опис майна', w: 'Опис майна' },
            B84: 
             { h: '(067) 123-4567',
               t: 's',
               v: '(067) 123-4567',
               w: '(067) 123-4567' },
            B85: { h: 'name@gmail', t: 's', v: 'name@gmail', w: 'name@gmail' },
            B86: 
             { h: 'Немає доходів або вони формуються переважно за рахунок непрофільних (неосновних) видів діяльності',
               t: 's',
               v: 'Немає доходів або вони формуються переважно за рахунок непрофільних (неосновних) видів діяльності',
               w: 'Немає доходів або вони формуються переважно за рахунок непрофільних (неосновних) видів діяльності' },
            B87: 
             { h: 'Попередня діяльність та професійний досвід клієнта суттєво відрізняються від того, що клієнт планує здійснювати, використовуючи послуги установи',
               t: 's',
               v: 'Попередня діяльність та професійний досвід клієнта суттєво відрізняються від того, що клієнт планує здійснювати, використовуючи послуги установи',
               w: 'Попередня діяльність та професійний досвід клієнта суттєво відрізняються від того, що клієнт планує здійснювати, використовуючи послуги установи' },
            B88: 
             { h: 'Наявність по клієнту запитів/рішень ДСФМУ або відповідального працівника',
               t: 's',
               v: 'Наявність по клієнту запитів/рішень ДСФМУ або відповідального працівника',
               w: 'Наявність по клієнту запитів/рішень ДСФМУ або відповідального працівника' },
            B89: 
             { h: 'Наявність відкритих кримінальних проваджень, запитів правоохоронних органів, виїмки документів клієнта',
               t: 's',
               v: 'Наявність відкритих кримінальних проваджень, запитів правоохоронних органів, виїмки документів клієнта',
               w: 'Наявність відкритих кримінальних проваджень, запитів правоохоронних органів, виїмки документів клієнта' },
            B9: 
             { h: 'Олександрович',
               t: 's',
               v: 'Олександрович',
               w: 'Олександрович' },
            B90: 
             { h: 'Наявність негативних фактів співпраці з клієнтом',
               t: 's',
               v: 'Наявність негативних фактів співпраці з клієнтом',
               w: 'Наявність негативних фактів співпраці з клієнтом' },
            B91: 
             { h: 'Належність до осіб, пов&apos;язаних із здійсненням терористичної діяльності або щодо яких застосовано міжнародні санкції',
               t: 's',
               v: 'Належність до осіб, пов\'язаних із здійсненням терористичної діяльності або щодо яких застосовано міжнародні санкції',
               w: 'Належність до осіб, пов\'язаних із здійсненням терористичної діяльності або щодо яких застосовано міжнародні санкції' },
            B92: 
             { h: 'Клієнт використовує продукти (послуги), які мають хоча б одну з таких ознак:',
               t: 's',
               v: 'Клієнт використовує продукти (послуги), які мають хоча б одну з таких ознак:',
               w: 'Клієнт використовує продукти (послуги), які мають хоча б одну з таких ознак:' },
            B93: 
             { h: 'Здійснений виїзд на місце ведення діяльності',
               t: 's',
               v: 'Здійснений виїзд на місце ведення діяльності',
               w: 'Здійснений виїзд на місце ведення діяльності' },
            B94: { h: 'Назва', t: 's', v: 'Назва', w: 'Назва' },
            B95: 
             { h: 'Дата розрахунку',
               t: 's',
               v: 'Дата розрахунку',
               w: 'Дата розрахунку' },
            B96: 
             { h: 'Дата розрахунку',
               t: 's',
               v: 'Дата розрахунку',
               w: 'Дата розрахунку' },
            B97: 
             { h: 'Дата розрахунку',
               t: 's',
               v: 'Дата розрахунку',
               w: 'Дата розрахунку' },
            B98: { h: 'Ризик', t: 's', v: 'Ризик', w: 'Ризик' },
            B99: 
             { h: 'Дата розрахунку',
               t: 's',
               v: 'Дата розрахунку',
               w: 'Дата розрахунку' },
            C19: { h: 'Україна', t: 's', v: 'Україна', w: 'Україна' },
            C2: 
             { h: 'Дата створення:',
               t: 's',
               v: 'Дата створення:',
               w: 'Дата створення:' },
            C20: { h: '-', t: 's', v: '-', w: '-' },
            C21: { h: '-', t: 's', v: '-', w: '-' },
            C22: 
             { h: 'м.Київ, вул. Бандери Степана, буд. 1, к.1, кв.1',
               t: 's',
               v: 'м.Київ, вул. Бандери Степана, буд. 1, к.1, кв.1',
               w: 'м.Київ, вул. Бандери Степана, буд. 1, к.1, кв.1' },
            C23: { h: 'Україна', t: 's', v: 'Україна', w: 'Україна' },
            C24: { h: '-', t: 's', v: '-', w: '-' },
            C25: { h: '-', t: 's', v: '-', w: '-' },
            C26: 
             { h: 'м.Київ, вул. Бандери Степана, буд. 1, к.1, кв.1',
               t: 's',
               v: 'м.Київ, вул. Бандери Степана, буд. 1, к.1, кв.1',
               w: 'м.Київ, вул. Бандери Степана, буд. 1, к.1, кв.1' },
            C29: { h: 'виписка', t: 's', v: 'виписка', w: 'виписка' },
            C30: { h: 'КА', t: 's', v: 'КА', w: 'КА' },
            C31: { h: '123456', t: 's', v: '123456', w: '123456' },
            C32: 
             { h: '64.19 Інші види грошового посередництва (основний);',
               t: 's',
               v: '64.19 Інші види грошового посередництва (основний);',
               w: '64.19 Інші види грошового посередництва (основний);' },
            C33: 
             { h: '64.91 Фінансовий лізинг;',
               t: 's',
               v: '64.91 Фінансовий лізинг;',
               w: '64.91 Фінансовий лізинг;' },
            C34: 
             { h: '64.92 Інші види кредитування;',
               t: 's',
               v: '64.92 Інші види кредитування;',
               w: '64.92 Інші види кредитування;' },
            C35: 
             { h: 'приватний нотаріус',
               t: 's',
               v: 'приватний нотаріус',
               w: 'приватний нотаріус' },
            C36: { h: '2020-03-01', t: 's', v: '2020-03-01', w: '2020-03-01' },
            C37: 
             { h: '1234567891011121314151617',
               t: 's',
               v: '1234567891011121314151617',
               w: '1234567891011121314151617' },
            C38: 
             { h: 'Київська міська рада',
               t: 's',
               v: 'Київська міська рада',
               w: 'Київська міська рада' },
            C39: 
             { h: 'Політично значуща особа !',
               t: 's',
               v: 'Політично значуща особа !',
               w: 'Політично значуща особа !' },
            C40: { h: 'Депутат', t: 's', v: 'Депутат', w: 'Депутат' },
            C41: { h: 'Олександров', t: 's', v: 'Олександров', w: 'Олександров' },
            C42: { h: 'Олександр', t: 's', v: 'Олександр', w: 'Олександр' },
            C43: 
             { h: 'Олександрович',
               t: 's',
               v: 'Олександрович',
               w: 'Олександрович' },
            C44: { h: '2021-07-07', t: 's', v: '2021-07-07', w: '2021-07-07' },
            C45: { h: '2021-07-08', t: 's', v: '2021-07-08', w: '2021-07-08' },
            C46: { h: 'Так', t: 's', v: 'Так', w: 'Так' },
            C47: { h: 'Іван', t: 's', v: 'Іван', w: 'Іван' },
            C48: { h: 'Іванов', t: 's', v: 'Іванов', w: 'Іванов' },
            C49: { h: 'Іванович', t: 's', v: 'Іванович', w: 'Іванович' },
            C50: { h: '12345678910', t: 's', v: '12345678910', w: '12345678910' },
            C51: { t: 'n', v: 1231234321, w: '1231234321' },
            C52: { h: '1999-07-01', t: 's', v: '1999-07-01', w: '1999-07-01' },
            C53: 
             { h: 'паспорт громадянина України для виїзду за кордон',
               t: 's',
               v: 'паспорт громадянина України для виїзду за кордон',
               w: 'паспорт громадянина України для виїзду за кордон' },
            C54: { h: 'ААВС', t: 's', v: 'ААВС', w: 'ААВС' },
            C55: { h: '12345678910', t: 's', v: '12345678910', w: '12345678910' },
            C56: 
             { h: 'Київський РВ УМВС',
               t: 's',
               v: 'Київський РВ УМВС',
               w: 'Київський РВ УМВС' },
            C57: { h: '2015-10-01', t: 's', v: '2015-10-01', w: '2015-10-01' },
            C58: { h: 'Країна', t: 's', v: 'Країна', w: 'Країна' },
            C59: 
             { h: 'Область (за наявності)',
               t: 's',
               v: 'Область (за наявності)',
               w: 'Область (за наявності)' },
            C60: 
             { h: 'Район (за наявності)',
               t: 's',
               v: 'Район (за наявності)',
               w: 'Район (за наявності)' },
            C61: { h: 'Адреса', t: 's', v: 'Адреса', w: 'Адреса' },
            C62: { h: 'Україна', t: 's', v: 'Україна', w: 'Україна' },
            C63: { h: 'довіреність', t: 's', v: 'довіреність', w: 'довіреність' },
            C64: { h: 'Так', t: 's', v: 'Так', w: 'Так' },
            C65: 
             { h: 'фываываывафывфывфыв',
               t: 's',
               v: 'фываываывафывфывфыв',
               w: 'фываываывафывфывфыв' },
            C70: { h: 'ПриватБанк', t: 's', v: 'ПриватБанк', w: 'ПриватБанк' },
            C71: { h: '328704', t: 's', v: '328704', w: '328704' },
            C72: 
             { h: 'UA101010101010101010101010101',
               t: 's',
               v: 'UA101010101010101010101010101',
               w: 'UA101010101010101010101010101' },
            C73: { h: 'УкрСибБанк', t: 's', v: 'УкрСибБанк', w: 'УкрСибБанк' },
            C74: { h: '704328', t: 's', v: '704328', w: '704328' },
            C75: 
             { h: 'UA101010101010101010101010101',
               t: 's',
               v: 'UA101010101010101010101010101',
               w: 'UA101010101010101010101010101' },
            C78: 
             { h: 'транспортні засоби, що належать державній реєстрації',
               t: 's',
               v: 'транспортні засоби, що належать державній реєстрації',
               w: 'транспортні засоби, що належать державній реєстрації' },
            C79: 
             { h: 'автомобіль марки TOYOTA, модель LEAND CRUIZER, 2021 року випуску',
               t: 's',
               v: 'автомобіль марки TOYOTA, модель LEAND CRUIZER, 2021 року випуску',
               w: 'автомобіль марки TOYOTA, модель LEAND CRUIZER, 2021 року випуску' },
            C80: { h: 'нерухомість', t: 's', v: 'нерухомість', w: 'нерухомість' },
            C81: 
             { h: 'офііс площею 100 кв.м. за адресом - м.Київ, проспект Небесної Сотні, буд. 100, оф. 501',
               t: 's',
               v: 'офііс площею 100 кв.м. за адресом - м.Київ, проспект Небесної Сотні, буд. 100, оф. 501',
               w: 'офііс площею 100 кв.м. за адресом - м.Київ, проспект Небесної Сотні, буд. 100, оф. 501' },
            C82: 
             { h: 'грошові кошти на рахунку в банках',
               t: 's',
               v: 'грошові кошти на рахунку в банках',
               w: 'грошові кошти на рахунку в банках' },
            C83: 
             { h: '100 000,00 грн. на депозитному рахунку',
               t: 's',
               v: '100 000,00 грн. на депозитному рахунку',
               w: '100 000,00 грн. на депозитному рахунку' },
            C86: { h: 'Ні', t: 's', v: 'Ні', w: 'Ні' },
            C87: { h: 'Ні', t: 's', v: 'Ні', w: 'Ні' },
            C88: { h: 'Ні', t: 's', v: 'Ні', w: 'Ні' },
            C89: { h: 'Так', t: 's', v: 'Так', w: 'Так' },
            C90: { h: 'Ні', t: 's', v: 'Ні', w: 'Ні' },
            C91: { h: 'Так', t: 's', v: 'Так', w: 'Так' },
            C92: { t: 'n', v: 3, w: '3' },
            C94: 
             { h: '10500 - зняття готівки',
               t: 's',
               v: '10500 - зняття готівки',
               w: '10500 - зняття готівки' },
            C95: { h: '1993-10-09', t: 's', v: '1993-10-09', w: '1993-10-09' },
            C96: { h: '2021-07-06', t: 's', v: '2021-07-06', w: '2021-07-06' },
            C97: { h: '2021-07-06', t: 's', v: '2021-07-06', w: '2021-07-06' },
            C98: { h: 'високий', t: 's', v: 'високий', w: 'високий' },
            C99: { h: '2021-07-06', t: 's', v: '2021-07-06', w: '2021-07-06' },
            D2: 
             { h: '29/09/2021, 21:51:22',
               t: 's',
               v: '29/09/2021, 21:51:22',
               w: '29/09/2021, 21:51:22' },
            D58: { h: 'Україна', t: 's', v: 'Україна', w: 'Україна' },
            D59: { h: '-', t: 's', v: '-', w: '-' },
            D60: { h: '-', t: 's', v: '-', w: '-' },
            D61: 
             { h: 'м.Бориспіль, вул. Академіка Вернадського, буд. 1, кв. 1',
               t: 's',
               v: 'м.Бориспіль, вул. Академіка Вернадського, буд. 1, кв. 1',
               w: 'м.Бориспіль, вул. Академіка Вернадського, буд. 1, кв. 1' } },
          };
          wb.Sheets["Анкета"].should
            .excluding(["D2"])
            .deep.equal(obj["Анкета"]);
          XLSX.writeFile(wb, "out.xlsx");
          res.should.have.status(200);

          done();
        });
    });
    // it("it get Person buf of file  ", (done) => {
    //   chai
    //     .request(server)
    //     .get("/api/person/file")
    //     .set("Authorization", token)
    //     .query({ id: newPerson._id.toString() })
    //     .end(async (err, res) => {
    //       const wb = XLSX.read(res.body.result, { type: "base64" });
    //       XLSX.writeFile(wb, "out.xlsx");
    //       done();
    //     });
    // });
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
                msg: "Невірний id",
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
                msg: "Невірний тип id",
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
//};
//module.exports = test;
