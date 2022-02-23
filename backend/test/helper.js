const chai = require("chai");
const chaihttp = require("chai-http");
const chaiExclude = require("chai-exclude");
chai.config.includeStack = true;
const userService=require("../services/user")
const helperService = require("../services/helper");
let translate = require("../mock/personTranslate.json");

let token = "";
const user = require("../mock/adminUser.json");
chai.should();
chai.use(chaihttp);
chai.use(chaiExclude);

let test = (server) => {
  describe("test Helper api", () => {
    before(async () => {
      await userService.deleteAll();
      await userService.create(user);
      let res = await chai.request(server).post("/api/user/login").send({
        username: user.username,
        password: user.password,
      });
      token = res.body.token;
    });
    describe("Helper/create ", () => {
      beforeEach(async function () {
        await helperService.deleteAll();
      });

      it("it create new Helper", async () => {
        const CreateHelper = {
          name: translate.name,
          result: translate.result,
        };
        let res = await chai
          .request(server)
          .post("/api/helper/create")
          .set("Authorization", token)
          .send(CreateHelper);
        res.body.should.deep.equal({
          message: "helper was create",
          result: {
            ...CreateHelper,
          },
          success: true,
        });
        res.should.have.status(201);
      });
      it("it create new helper with auth err ", async () => {
        const CreateHelper = {
          name: translate.name,
          result: translate.result,
        };
        let res = await chai
          .request(server)
          .post("/api/helper/create")
          .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
          .send(CreateHelper);
        res.should.have.status(401);
      });
      it("it negative test send create new helper with mistake property name suspect validation err ", async () => {
        const CreateHelper = {
          name1: translate.name,
          result: translate.result,
        };
        let res = await chai
          .request(server)
          .post("/api/helper/create")
          .set("Authorization", token)
          .send(CreateHelper);
        res.should.have.status(400);
        res.body.should.deep.equal({
          message: "Validation error",
          validation: false,
          success: false,
          error: [{ msg: "Поле Name пустое", param: "name", location: "body" }],
        });
      });
      it("it negative test send create new helper with null result suspesct validation err ", async () => {
        const CreateHelper = {};
        let res = await chai
          .request(server)
          .post("/api/helper/create")
          .set("Authorization", token)
          .send(CreateHelper);
        res.should.have.status(400);
        res.body.should.deep.equal({
          message: "Validation error",
          validation: false,
          success: false,
          error: [
            {
              msg: "Поле Name пустое",
              param: "name",
              location: "body",
            },
            {
              msg: "Поле result пустое",
              param: "result",
              location: "body",
            },
          ],
        });
      });
    });

    describe("Helper/getById", () => {
      let newHelper;
      let oldHelper;
      before(async () => {
        await helperService.deleteAll();
        oldHelper = {
          name: translate.name,
          result: translate.result,
        };
        newHelper = await helperService.create(
          oldHelper.name,
          oldHelper.result
        );
      });
      it("it get helper by id", async () => {
        let res = await chai
          .request(server)
          .get("/api/helper/")
          .set("Authorization", token)
          .query({ name: newHelper.name });

        res.should.have.status(200);
        res.body.should.deep.equal({
          message: "helper get by name was complited",
          result: {
            ...oldHelper.result,
          },
          success: true,
        });
      });
      it("it negative test get helper by name with wrong name", async () => {
        let res = await chai
          .request(server)
          .get("/api/helper/")
          .set("Authorization", token)
          .query({ name: "perers" }); //wrong name

        res.should.have.status(400);
        res.body.should.have.property("message").eql("Validation error");
        res.body.should.have.property("validation").eql(false);
        res.body.should.have.property("error").deep.equal([
          {
            value: "perers",
            msg: "Helper не найден",
            param: "name",
            location: "query",
          },
        ]);
      });
      it("it negative test get helper by name with empty text", async () => {
        let res = await chai
          .request(server)
          .get("/api/helper/")
          .set("Authorization", token)
          .query({ name: "" }); //wrong id

        res.should.have.status(400);
        res.body.should.have.property("message").eql("Validation error");
        res.body.should.have.property("validation").eql(false);
        res.body.should.have.property("error").deep.equal([
          {
            value: "",
            msg: "Поле name должно содержать больше 1 символа",
            param: "name",
            location: "query",
          },
        ]);
      });
    });
  });
};
module.exports = test;
