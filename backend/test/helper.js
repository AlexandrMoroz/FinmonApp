const chai = require("chai");
const chaihttp = require("chai-http");
const chaiExclude = require("chai-exclude");
chai.config.includeStack = true;

const Helper = require("../models/helper");
let translate = require("../mock/personTranslate.json");

//const server = "http://localhost:4000";
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
  describe("test Helper api", () => {
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
    describe("Helper/create ", () => {
      beforeEach(async function () {
        await Helper.deleteMany({});
      });

      it("it create new Helper", (done) => {
        const CreateHelper = {
          name: translate.name,
          content: translate.content,
        };
        chai
          .request(server)
          .post("/api/helper/create")
          .set("Authorization", token)
          .send(CreateHelper)
          .end((err, res) => {
            res.body.should.deep.equal({
              message: "helper was create",
              result: {
                ...CreateHelper,
              },
              success: true,
            });
            res.should.have.status(201);
            done();
          });
      });
      it("it create new helper with auth err ", (done) => {
        const CreateHelper = {
          name: translate.name,
          content: translate.content,
        };
        chai
          .request(server)
          .post("/api/helper/create")
          .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
          .send(CreateHelper)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });
      it("it negative test send create new helper with mistake property name suspect validation err ", (done) => {
        const CreateHelper = {
          name1: translate.name,
          content: translate.content,
        };
        chai
          .request(server)
          .post("/api/helper/create")
          .set("Authorization", token)
          .send(CreateHelper)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("message").eql("Validation error");
            res.body.should.have.property("validation").eql(false);
            res.body.should.deep.equal({
              message: "Validation error",
              validation: false,
              success: false,
              error: [
                { msg: "Поле Name пустое", param: "name", location: "body" },
              ],
            });
            done();
          });
      });
      it("it negative test send create new helper with null result suspesct validation err ", (done) => {
        const CreateHelper = {};
        chai
          .request(server)
          .post("/api/helper/create")
          .set("Authorization", token)
          .send(CreateHelper)
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
                  msg: "Поле Name пустое",
                  param: "name",
                  location: "body",
                },
                {
                  msg: "Поле content пустое",
                  param: "content",
                  location: "body",
                },
              ],
            });
            done();
          });
      });
    });

    describe("Helper/getById", () => {
      let newHelper;
      let oldHelper;
      before(async () => {
        await Helper.deleteMany({});
        oldHelper = {
          name: translate.name,
          content: translate.content,
        };
        newHelper = await new Helper({
          name: oldHelper.name,
          content: oldHelper.content,
        }).save();
      });
      it("it get helper by id", (done) => {
        chai
          .request(server)
          .get("/api/helper/")
          .set("Authorization", token)
          .query({ name: newHelper.name })
          .end(async (err, res) => {
            res.should.have.status(200);
            res.body.should.deep.equal({
              message: "helper get by name was complited",
              result: {
                ...oldHelper.content,
              },
              success: true,
            });
            done();
          });
      });
      it("it negative test get helper by name with wrong name", (done) => {
        chai
          .request(server)
          .get("/api/helper/")
          .set("Authorization", token)
          .query({ name: "perers" }) //wrong name
          .end(async (err, res) => {
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
            //res.body.
            if (err) {
              done(err);
            }
            done();
          });
      });
      it("it negative test get helper by name with empty text", (done) => {
        chai
          .request(server)
          .get("/api/helper/")
          .set("Authorization", token)
          .query({ name: "" }) //wrong id
          .end(async (err, res) => {
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
            if (err) {
              done(err);
            }
            done();
          });
      });
    });
  });
};
module.exports = test;
