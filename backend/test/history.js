const chai = require("chai");
const chaihttp = require("chai-http");
const chaiExclude = require("chai-exclude");
chai.config.includeStack = true;
const XLSX = require("xlsx");
const personService = require("../services/person");
const companyService = require("../services/company");
const historyService = require("../services/history");
const helperService = require("../services/helper");
const userService = require("../services/user");
let token = "";
const user = require("../mock/adminUser.json");

chai.should();
chai.use(chaihttp);
chai.use(chaiExclude);
let initServiceByMockAndHistory = async (
  oldResult,
  editResult,
  serviceName
) => {
  await companyService.deleteAll();
  await personService.deleteAll();
  await historyService.deleteAll();
  if (serviceName === "company") {
    let createdModel = await companyService.create(user.username, oldResult);
    editResult = {
      _id: createdModel.id,
      formDataResultId: createdModel.formDataResultId,
      ...editResult,
    };
    return await companyService.edit(user.username, editResult);
  }
  if (serviceName === "person") {
    let createdModel = await personService.create(user.username, oldResult);
    editResult = {
      _id: createdModel.id,
      formDataResultId: createdModel.formDataResultId,
      ...editResult,
    };
    let a = await personService.edit(user.username, editResult);
    return a;
  }
};

let test = (server) => {
  describe("test History api", () => {
    before(async () => {
      await userService.deleteAll();
      await userService.create(user);
      let res = await chai.request(server).post("/api/user/login").send({
        username: user.username,
        password: user.password,
      });
      token = res.body.token;
    });
    describe("History/getPersonJSONHistory ", () => {
      let newPerson;
      let oldPerson;
      before(async () => {
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
        let editResult = {
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
            IsResident: false,
          },
        };
        newPerson = await initServiceByMockAndHistory(
          oldPerson.result,
          editResult,
          "person"
        );
        let translate = require("../mock/personTranslate.json");
        await helperService.create(translate.name, translate.result);
      });

      it("it get Person json History", async () => {
        const HistoryCred = {
          id: newPerson.formDataResultId.toString(),
        };
        let res = await chai
          .request(server)
          .get("/api/history/person-history")
          .set("Authorization", token)
          .query(HistoryCred);

        res.body.result[0].diff.should.deep.equal([
          { op: "Замінено", path: "Прізвище", was: "Moroz", became: "Moroz2" },
          { op: "Замінено", path: "Чи резидент", was: "Так", became: "Ні" },
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
      });
      it("it get Person json History with auth err ", async () => {
        const HistoryCred = {
          id: newPerson.formDataResultId.toString(),
        };
        let res = await chai
          .request(server)
          .get("/api/history/person-history")
          .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
          .query(HistoryCred);

        res.should.have.status(401);
      });
      it("it negative test send get Person json History with not exists id property suspect validation err ", async () => {
        const HistoryCred = {
          id: "10adf77dfb53d91e28576c74",
        };
        let res = await chai
          .request(server)
          .get("/api/history/person-history")
          .set("Authorization", token)
          .query(HistoryCred);

        res.should.have.status(400);

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
      });
      it("it negative test send create new helper with null result suspesct validation err ", async () => {
        const HistoryCred = {};
        let res = await chai
          .request(server)
          .get("/api/history/person-history")
          .set("Authorization", token)
          .query(HistoryCred);

        res.should.have.status(400);
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
      });
    });

    describe("History/getPersonHistoryFile ", () => {
      let newPerson;
      let oldPerson;
      before(async () => {
        await personService.deleteAll();
        await historyService.deleteAll();
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
        newPerson = await initServiceByMockAndHistory(
          oldPerson.result,
          editResult,
          "person"
        );
      });

      it("it get person history file", async () => {
        let res = await chai
          .request(server)
          .get("/api/history/person-history-file")
          .set("Authorization", token)
          .query({ id: newPerson.formDataResultId.toString() });

        const wb = XLSX.read(res.body.result, { type: "base64" });
        let shouldEquals = {
          "!ref": "A1:D8",
          A1: {
            t: "s",
            v: "Користувач: ",
            h: "Користувач: ",
            w: "Користувач: ",
          },
          B1: {
            t: "s",
            v: "alexandr1, moroz1, sergeevich1",
            h: "alexandr1, moroz1, sergeevich1",
            w: "alexandr1, moroz1, sergeevich1",
          },
          C1: {
            t: "s",
            v: "Дата створенно",
            h: "Дата створенно",
            w: "Дата створенно",
          },
          D1: {
            t: "s",
            v: "23.02.2022, 15:17:29",
            h: "23.02.2022, 15:17:29",
            w: "23.02.2022, 15:17:29",
          },
          A2: { t: "s", v: "Додано", h: "Додано", w: "Додано" },
          B2: {
            t: "s",
            v: "Дата первинного заповнення анкети",
            h: "Дата первинного заповнення анкети",
            w: "Дата первинного заповнення анкети",
          },
          C2: { t: "s", v: "12.12.2021", h: "12.12.2021", w: "12.12.2021" },
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
          B7: { t: "s", v: "По батькові", h: "По батькові", w: "По батькові" },
          C7: { t: "s", v: "was", h: "was", w: "was" },
          D7: { t: "s", v: "Sergeevich", h: "Sergeevich", w: "Sergeevich" },
          C8: { t: "s", v: "became", h: "became", w: "became" },
          D8: { t: "s", v: "Sergeevich2", h: "Sergeevich2", w: "Sergeevich2" },
        };
        wb.Sheets["Історія"].should.excluding(["D1"]).deep.equal(shouldEquals);
        res.should.have.status(200);
      });
      it("it get Person history file with auth err ", async () => {
        const HistoryCred = {
          id: newPerson._id.toString(),
        };
        let res = await chai
          .request(server)
          .get("/api/history/person-history-file")
          .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
          .query(HistoryCred);

        res.should.have.status(401);
      });
      it("it negative test send get Person history file with not exists id property suspect validation err ", async () => {
        const HistoryCred = {
          id: "10adf77dfb53d91e28576c74", //not exists id
        };
        let res = await chai
          .request(server)
          .get("/api/history/person-history-file")
          .set("Authorization", token)
          .query(HistoryCred);

        res.should.have.status(400);
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
      });
      it("it negative test send get Person history file with null result suspesct validation err ", async () => {
        const HistoryCred = {};
        let res = await chai
          .request(server)
          .get("/api/history/person-history-file")
          .set("Authorization", token)
          .query(HistoryCred);

        res.should.have.status(400);
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
      });
    });

    describe("History/getCompanyJSONHistory ", () => {
      let newCompany;
      let oldCompany;

      before(async () => {
        await companyService.deleteAll();
        await historyService.deleteAll({});
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
        newCompany = await initServiceByMockAndHistory(
          oldCompany.result,
          editResult,
          "company"
        );
      });

      it("it get Company json History", async () => {
        const HistoryCred = {
          id: newCompany.formDataResultId.toString(),
        };
        let res = await chai
          .request(server)
          .get("/api/history/company-history")
          .set("Authorization", token)
          .query({ ...HistoryCred });

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
      });
      it("it get Person json History with auth err ", async () => {
        const HistoryCred = {
          id: newCompany.formDataResultId.toString(),
        };
        let res = await chai
          .request(server)
          .get("/api/history/person-history")
          .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
          .query(HistoryCred);

        res.should.have.status(401);
      });
      it("it negative test send get Person json History with not exists id property suspect validation err ", async () => {
        const HistoryCred = {
          id: "10adf77dfb53d91e28576c74",
        };
        let res = await chai
          .request(server)
          .get("/api/history/person-history")
          .set("Authorization", token)
          .query(HistoryCred);

        res.should.have.status(400);
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
      });
      it("it negative test send create new helper with null result suspesct validation err ", async () => {
        const HistoryCred = {};
        let res = await chai
          .request(server)
          .get("/api/history/person-history")
          .set("Authorization", token)
          .query(HistoryCred);

        res.should.have.status(400);
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
      });
    });

    describe("History/getCompanyHistoryFile ", () => {
      let newCompany;
      let oldCompany;

      before(async () => {
        await companyService.deleteAll();
        await historyService.deleteAll({});
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
        newCompany = await initServiceByMockAndHistory(
          oldCompany.result,
          editResult,
          "company"
        );
      });

      it("it get company History file", async () => {
        const HistoryCred = {
          id: newCompany.formDataResultId.toString(),
        };
        let res = await chai
          .request(server)
          .get("/api/history/company-history-file")
          .set("Authorization", token)
          .query({ ...HistoryCred });

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
              v: "alexandr1, moroz1, sergeevich1",
              h: "alexandr1, moroz1, sergeevich1",
              w: "alexandr1, moroz1, sergeevich1",
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
      });
      it("it get company history file with auth err ", async () => {
        const HistoryCred = {
          id: newCompany._id.toString(),
        };
        let res = await chai
          .request(server)
          .get("/api/history/company-history-file")
          .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
          .query(HistoryCred);

        res.should.have.status(401);
      });
      it("it negative test send get company history file with not exists id property suspect validation err ", async () => {
        const HistoryCred = {
          id: "10adf77dfb53d91e28576c74", //not exists id
        };
        let res = await chai
          .request(server)
          .get("/api/history/company-history-file")
          .set("Authorization", token)
          .query(HistoryCred);

        res.should.have.status(400);
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
      });
      it("it negative test send get company history file with null result suspesct validation err ", async () => {
        const HistoryCred = {};
        let res = await chai
          .request(server)
          .get("/api/history/company-history-file")
          .set("Authorization", token)
          .query(HistoryCred);

        res.should.have.status(400);
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
      });
    });
  });
};
module.exports = test;
