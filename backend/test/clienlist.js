const chai = require("chai");
const chaihttp = require("chai-http");
const chaiExclude = require("chai-exclude");
chai.config.includeStack = true;
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const XLSX = require("xlsx");
const personService = require("../services/person");
const companyService = require("../services/company");
const helperService = require("../services/helper");
const XLSXClientFullList = require("../utils/fullClientList");
const clientSerialize = require("../utils/clientSerializer");
let adminToken = "";
let simpleUserToken = "";
const adminUser = require("../mock/adminUser.json");
const simpleUser = require("../mock/simpleUser.json");
chai.should();
chai.use(chaihttp);
chai.use(chaiExclude);
let person = require("../mock/personForClientList.json");
let company = require("../mock/companyForClientList.json");
let translate = require("../mock/personTranslate.json");
let newperson;
module.exports = (server) => {
  describe("test client full list", () => {
    before(async () => {
      await personService.deleteAll();
      await companyService.deleteAll();
      newperson = await personService.create(adminUser.username, person.result);
      await companyService.create(adminUser.username, company.result);
      await helperService.create("translate", translate.result);
    });
    describe("test client full list unit ", async () => {
      it("it create document one client ", async () => {
        let shouldEquals = {
          "!ref": "A1:L4",
          B2: { t: "s", v: "Клієнт", h: "Клієнт", w: "Клієнт" },
          C2: {
            t: "s",
            v: "Код РНОКПП / ЄДРПОУ",
            h: "Код РНОКПП / ЄДРПОУ",
            w: "Код РНОКПП / ЄДРПОУ",
          },
          D2: { t: "s", v: "ОПФ", h: "ОПФ", w: "ОПФ" },
          E2: {
            t: "s",
            v: "Резидентність",
            h: "Резидентність",
            w: "Резидентність",
          },
          F2: {
            t: "s",
            v: "Проживання/Реєстарция",
            h: "Проживання/Реєстарция",
            w: "Проживання/Реєстарция",
          },
          G2: {
            t: "s",
            v: "Перебування/Фактичне місцезнаходження",
            h: "Перебування/Фактичне місцезнаходження",
            w: "Перебування/Фактичне місцезнаходження",
          },
          H2: {
            t: "s",
            v: "дата договору/операції",
            h: "дата договору/операції",
            w: "дата договору/операції",
          },
          I2: { t: "s", v: "РЕР", h: "РЕР", w: "РЕР" },
          J2: {
            t: "s",
            v: "Дата виявлення РЕР",
            h: "Дата виявлення РЕР",
            w: "Дата виявлення РЕР",
          },
          K2: {
            t: "s",
            v: "рівень ризику",
            h: "рівень ризику",
            w: "рівень ризику",
          },
          L2: { t: "s", v: "дата оцінки", h: "дата оцінки", w: "дата оцінки" },
          B3: {
            t: "s",
            v: "Василь Іванов Алібабаєвич",
            h: "Василь Іванов Алібабаєвич",
            w: "Василь Іванов Алібабаєвич",
          },
          C3: { t: "s", v: "1234567891", h: "1234567891", w: "1234567891" },
          D3: {
            t: "s",
            v: "фізична особа",
            h: "фізична особа",
            w: "фізична особа",
          },
          E3: { t: "s", v: "нерезидент", h: "нерезидент", w: "нерезидент" },
          F3: { t: "s", v: "Беліз", h: "Беліз", w: "Беліз" },
          G3: { t: "s", v: "Беліз", h: "Беліз", w: "Беліз" },
          H3: { t: "s", v: "2021-09-08", h: "2021-09-08", w: "2021-09-08" },
          I3: { t: "b", v: true, w: "TRUE" },
          J3: { t: "s", v: "01/02/2021", h: "01/02/2021", w: "01/02/2021" },
          K3: { t: "s", v: "Негатинно", h: "Негатинно", w: "Негатинно" },
          L3: { t: "s", v: "2022-09-07", h: "2022-09-07", w: "2022-09-07" },
          K4: { t: "s", v: "Негатинно", h: "Негатинно", w: "Негатинно" },
          L4: { t: "s", v: "2021-02-01", h: "2021-02-01", w: "2021-02-01" },
        };
        let fullClientList = new XLSXClientFullList();
        let person = await personService.getFormDataById(
          newperson.formDataResultId
        );
        let serialize = clientSerialize(person.result);
        let buf = fullClientList.createBuf([serialize]);
        const wb = XLSX.read(buf, { type: "base64" });
        wb.Sheets["Список клієнтів"].should.deep.equal(shouldEquals);
      });
      it("it create document multi clients", async () => {
        let shouldEquals = {
          "!ref": "A1:L6",
          B2: { t: "s", v: "Клієнт", h: "Клієнт", w: "Клієнт" },
          C2: {
            t: "s",
            v: "Код РНОКПП / ЄДРПОУ",
            h: "Код РНОКПП / ЄДРПОУ",
            w: "Код РНОКПП / ЄДРПОУ",
          },
          D2: { t: "s", v: "ОПФ", h: "ОПФ", w: "ОПФ" },
          E2: {
            t: "s",
            v: "Резидентність",
            h: "Резидентність",
            w: "Резидентність",
          },
          F2: {
            t: "s",
            v: "Проживання/Реєстарция",
            h: "Проживання/Реєстарция",
            w: "Проживання/Реєстарция",
          },
          G2: {
            t: "s",
            v: "Перебування/Фактичне місцезнаходження",
            h: "Перебування/Фактичне місцезнаходження",
            w: "Перебування/Фактичне місцезнаходження",
          },
          H2: {
            t: "s",
            v: "дата договору/операції",
            h: "дата договору/операції",
            w: "дата договору/операції",
          },
          I2: { t: "s", v: "РЕР", h: "РЕР", w: "РЕР" },
          J2: {
            t: "s",
            v: "Дата виявлення РЕР",
            h: "Дата виявлення РЕР",
            w: "Дата виявлення РЕР",
          },
          K2: {
            t: "s",
            v: "рівень ризику",
            h: "рівень ризику",
            w: "рівень ризику",
          },
          L2: { t: "s", v: "дата оцінки", h: "дата оцінки", w: "дата оцінки" },
          B3: {
            t: "s",
            v: "Василь Іванов Алібабаєвич",
            h: "Василь Іванов Алібабаєвич",
            w: "Василь Іванов Алібабаєвич",
          },
          C3: { t: "s", v: "1234567891", h: "1234567891", w: "1234567891" },
          D3: {
            t: "s",
            v: "фізична особа",
            h: "фізична особа",
            w: "фізична особа",
          },
          E3: { t: "s", v: "нерезидент", h: "нерезидент", w: "нерезидент" },
          F3: { t: "s", v: "Беліз", h: "Беліз", w: "Беліз" },
          G3: { t: "s", v: "Беліз", h: "Беліз", w: "Беліз" },
          H3: { t: "s", v: "2021-09-08", h: "2021-09-08", w: "2021-09-08" },
          I3: { t: "b", v: true, w: "TRUE" },
          J3: { t: "s", v: "01/02/2021", h: "01/02/2021", w: "01/02/2021" },
          K3: { t: "s", v: "Негатинно", h: "Негатинно", w: "Негатинно" },
          L3: { t: "s", v: "2022-09-07", h: "2022-09-07", w: "2022-09-07" },
          K4: { t: "s", v: "Негатинно", h: "Негатинно", w: "Негатинно" },
          L4: { t: "s", v: "2021-02-01", h: "2021-02-01", w: "2021-02-01" },
          B5: {
            t: "s",
            v: 'ТОВ "ГЕРМЕС"',
            h: "ТОВ &quot;ГЕРМЕС&quot;",
            w: 'ТОВ "ГЕРМЕС"',
          },
          C5: { t: "s", v: "12345678", h: "12345678", w: "12345678" },
          D5: {
            t: "s",
            v: "юридична особа",
            h: "юридична особа",
            w: "юридична особа",
          },
          E5: { t: "s", v: "нерезидент", h: "нерезидент", w: "нерезидент" },
          F5: { t: "s", v: "Камбоджа", h: "Камбоджа", w: "Камбоджа" },
          G5: { t: "s", v: "Іран", h: "Іран", w: "Іран" },
          H5: { t: "s", v: "2021-09-08", h: "2021-09-08", w: "2021-09-08" },
          I5: { t: "b", v: true, w: "TRUE" },
          J5: { t: "s", v: "01/02/2022", h: "01/02/2022", w: "01/02/2022" },
          K5: { t: "s", v: "позитино", h: "позитино", w: "позитино" },
          L5: { t: "s", v: "2022-09-07", h: "2022-09-07", w: "2022-09-07" },
          K6: { t: "s", v: "Негатинно", h: "Негатинно", w: "Негатинно" },
          L6: { t: "s", v: "2021-02-01", h: "2021-02-01", w: "2021-02-01" },
        };
        let fullClientList = new XLSXClientFullList();
        let persons = await personService.getAllFormData();
        let serializePerson = persons.map((item) => clientSerialize(item));
        let companeis = await companyService.getAllFormData();
        let serializeCompanies = companeis.map((item) => clientSerialize(item));
        let buf = fullClientList.createBuf([
          ...serializePerson,
          ...serializeCompanies,
        ]);
        const wb = XLSX.read(buf, { type: "base64" });
        wb.Sheets["Список клієнтів"].should.deep.equal(shouldEquals);
      });
    });
    describe("test api get all clients in xlsx file", async () => {
      before(async () => {
        try {
          await User.deleteMany({});
          let adminPassword = await bcrypt.hash(adminUser.password, 12);
          newuser = await new User({
            ...adminUser,
            password: adminPassword,
          }).save();
          let userPassword = await bcrypt.hash(simpleUser.password, 12);
          newuser = await new User({
            ...simpleUser,
            password: userPassword,
          }).save();

          let res = await chai.request(server).post("/api/user/login").send({
            username: adminUser.username,
            password: adminUser.password,
          });
          adminToken = res.body.token;
          res = await chai.request(server).post("/api/user/login").send({
            username: simpleUser.username,
            password: simpleUser.password,
          });
          simpleUserToken = res.body.token;
        } catch (err) {
          console.log(err);
        }
      });
      it("it get all clients", async () => {
        let shouldEquals = {
          "!ref": "A1:L6",
          B2: { t: "s", v: "Клієнт", h: "Клієнт", w: "Клієнт" },
          C2: {
            t: "s",
            v: "Код РНОКПП / ЄДРПОУ",
            h: "Код РНОКПП / ЄДРПОУ",
            w: "Код РНОКПП / ЄДРПОУ",
          },
          D2: { t: "s", v: "ОПФ", h: "ОПФ", w: "ОПФ" },
          E2: {
            t: "s",
            v: "Резидентність",
            h: "Резидентність",
            w: "Резидентність",
          },
          F2: {
            t: "s",
            v: "Проживання/Реєстарция",
            h: "Проживання/Реєстарция",
            w: "Проживання/Реєстарция",
          },
          G2: {
            t: "s",
            v: "Перебування/Фактичне місцезнаходження",
            h: "Перебування/Фактичне місцезнаходження",
            w: "Перебування/Фактичне місцезнаходження",
          },
          H2: {
            t: "s",
            v: "дата договору/операції",
            h: "дата договору/операції",
            w: "дата договору/операції",
          },
          I2: { t: "s", v: "РЕР", h: "РЕР", w: "РЕР" },
          J2: {
            t: "s",
            v: "Дата виявлення РЕР",
            h: "Дата виявлення РЕР",
            w: "Дата виявлення РЕР",
          },
          K2: {
            t: "s",
            v: "рівень ризику",
            h: "рівень ризику",
            w: "рівень ризику",
          },
          L2: { t: "s", v: "дата оцінки", h: "дата оцінки", w: "дата оцінки" },
          B3: {
            t: "s",
            v: "Василь Іванов Алібабаєвич",
            h: "Василь Іванов Алібабаєвич",
            w: "Василь Іванов Алібабаєвич",
          },
          C3: { t: "s", v: "1234567891", h: "1234567891", w: "1234567891" },
          D3: {
            t: "s",
            v: "фізична особа",
            h: "фізична особа",
            w: "фізична особа",
          },
          E3: { t: "s", v: "нерезидент", h: "нерезидент", w: "нерезидент" },
          F3: { t: "s", v: "Беліз", h: "Беліз", w: "Беліз" },
          G3: { t: "s", v: "Беліз", h: "Беліз", w: "Беліз" },
          H3: { t: "s", v: "2021-09-08", h: "2021-09-08", w: "2021-09-08" },
          I3: { t: "b", v: true, w: "TRUE" },
          J3: { t: "s", v: "01/02/2021", h: "01/02/2021", w: "01/02/2021" },
          K3: { t: "s", v: "Негатинно", h: "Негатинно", w: "Негатинно" },
          L3: { t: "s", v: "2022-09-07", h: "2022-09-07", w: "2022-09-07" },
          K4: { t: "s", v: "Негатинно", h: "Негатинно", w: "Негатинно" },
          L4: { t: "s", v: "2021-02-01", h: "2021-02-01", w: "2021-02-01" },
          B5: {
            t: "s",
            v: 'ТОВ "ГЕРМЕС"',
            h: "ТОВ &quot;ГЕРМЕС&quot;",
            w: 'ТОВ "ГЕРМЕС"',
          },
          C5: { t: "s", v: "12345678", h: "12345678", w: "12345678" },
          D5: {
            t: "s",
            v: "юридична особа",
            h: "юридична особа",
            w: "юридична особа",
          },
          E5: { t: "s", v: "нерезидент", h: "нерезидент", w: "нерезидент" },
          F5: { t: "s", v: "Камбоджа", h: "Камбоджа", w: "Камбоджа" },
          G5: { t: "s", v: "Іран", h: "Іран", w: "Іран" },
          H5: { t: "s", v: "2021-09-08", h: "2021-09-08", w: "2021-09-08" },
          I5: { t: "b", v: true, w: "TRUE" },
          J5: { t: "s", v: "01/02/2022", h: "01/02/2022", w: "01/02/2022" },
          K5: { t: "s", v: "позитино", h: "позитино", w: "позитино" },
          L5: { t: "s", v: "2022-09-07", h: "2022-09-07", w: "2022-09-07" },
          K6: { t: "s", v: "Негатинно", h: "Негатинно", w: "Негатинно" },
          L6: { t: "s", v: "2021-02-01", h: "2021-02-01", w: "2021-02-01" },
        };
        let res = await chai
          .request(server)
          .get("/api/helper/allclients")
          .set("Authorization", adminToken)
          .query();
        res.should.have.status(200);
        const wb = XLSX.read(res.body.result, { type: "base64" });
        wb.Sheets["Список клієнтів"].should.deep.equal(shouldEquals);
      });
      it("it get all clients 403 error", async () => {
        let res = await chai
          .request(server)
          .get("/api/helper/allclients")
          .set("Authorization", simpleUserToken)
          .query();
        res.should.have.status(403);
      });
    });
  });
};
