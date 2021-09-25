const chai = require("chai");
const chaihttp = require("chai-http");
const chaiExclude = require("chai-exclude");
chai.config.includeStack = true;
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const server = "http://localhost:4000";
let token = "";
const user = {
  block: false,
  role: "admin",
  name: "alexandr",
  family: "moroz1",
  surname: "sergeevich1",
  cashboxAdress:
    "68000, Одеська обл., м. Чорноморськ, проспект Миру, буд. 29-п/1",
  email: "alexandr@gmail.com",
  username: "alexandrMorozzz12",
  password: "123qwe123qwe",
};
let newuser;
chai.should();
chai.use(chaihttp);
chai.use(chaiExclude);

let test = () => {
  describe("test user api", () => {
    describe("user/create ", () => {
      before(async () => {
        await User.deleteMany({});
        let password = await bcrypt.hash(user.password, 12);
        newuser = await new User({ ...user, password }).save();
        let res = await chai.request(server).post("/api/user/login").send({
          username: user.username,
          password: user.password,
        });

        token = res.body.token;
      });
      it("it create new user", (done) => {
        const CreateUser = {
          block: false,
          role: "admin",
          name: "vadim",
          family: "tkalenko",
          surname: "anatolievich",
          cashboxAdress:
            "68000, Одеська обл., м. Чорноморськ, проспект Миру, буд. 29-п/1",
          email: "vadim@gmail.com",
          username: "vadim1",
          password: "123qwe123qwe",
        };
        chai
          .request(server)
          .post("/api/user/create")
          .set("Authorization", token)
          .send(CreateUser)
          .end((err, res) => {
            res.body.should.deep.equal({
              message: "User was created",
              success: true,
            });
            res.should.have.status(201);
            done();
          });
      });
      it("it create new user with auth err ", (done) => {
        const CreateUser = {
          block: false,
          role: "admin",
          name: "vadim",
          family: "tkalenko",
          surname: "anatolievich",
          cashboxAdress:
            "68000, Одеська обл., м. Чорноморськ, проспект Миру, буд. 29-п/1",
          email: "vadim@gmail.com",
          username: "vadim1",
          password: "123qwe123qwe",
        };
        chai
          .request(server)
          .post("/api/user/create")
          .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
          .send(CreateUser)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });
      it("it negative test send create new user with mistake property name suspect username not found validation err ", (done) => {
        const CreateUser = {
          block: false,
          role: "admin",
          name: "vadim",
          family: "tkalenko",
          surname: "anatolievich",
          cashboxAdress:
            "68000, Одеська обл., м. Чорноморськ, проспект Миру, буд. 29-п/1",
          email: "vadim@gmail.com",
          username1: "vadim1", //err
          password: "123qwe123qwe",
        };
        chai
          .request(server)
          .post("/api/user/create")
          .set("Authorization", token)
          .send(CreateUser)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.deep.equal({
              message: "Validation error",
              validation: false,
              success: false,
              error: [
                {
                  msg: "Поле логин не найденно",
                  param: "username",
                  location: "body",
                },
              ],
            });
            done();
          });
      });
      it("it negative test send create new user with mistake property name suspect username unique validation err ", (done) => {
        const CreateUser = {
          block: false,
          role: "admin",
          name: "vadim",
          family: "tkalenko",
          surname: "anatolievich",
          cashboxAdress:
            "68000, Одеська обл., м. Чорноморськ, проспект Миру, буд. 29-п/1",
          email: "vadim@gmail.com",
          username: "vadim1", //err
          password: "123qwe123qwe",
        };
        chai
          .request(server)
          .post("/api/user/create")
          .set("Authorization", token)
          .send(CreateUser)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.deep.equal({
              message: "Validation error",
              validation: false,
              success: false,
              error: [
                {
                  value: "vadim1",
                  msg: "Логин уже используется",
                  param: "username",
                  location: "body",
                },
              ],
            });
            done();
          });
      });
      it("it negative test send create new helper with null result suspesct validation err ", (done) => {
        const CreateUser = {};
        chai
          .request(server)
          .post("/api/user/create")
          .set("Authorization", token)
          .send(CreateUser)
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
                  msg: "Поле имя не найденно",
                  param: "name",
                  location: "body",
                },
                {
                  msg: "Поле фамилия не найденно",
                  param: "family",
                  location: "body",
                },
                {
                  msg: "Поле логин не найденно",
                  param: "username",
                  location: "body",
                },
                {
                  location: "body",
                  msg: "Поле пароль пустое",
                  param: "password",
                },
              ],
            });
            done();
          });
      });
    });

    describe("user/edit", () => {
      beforeEach(async () => {
        await User.deleteMany({});
        let password = await bcrypt.hash(user.password, 12);
        newuser = await new User({ ...user, password }).save();
        let res = await chai.request(server).post("/api/user/login").send({
          username: user.username,
          password: user.password,
        });
        token = res.body.token;
      });
      it("it edit user", (done) => {
        const EditUser = {
          id: newuser._id.toString(),
          block: false,
          role: "admin",
          name: "vadim2",
          family: "tkalenko2",
          surname: "anatolievich3",
          cashboxAdress:
            "68000, Одеська обл., м. Чорноморськ, проспект Миру, буд. 29-п/1",
          email: "vadim3@gmail.com",
          username: "vadim1",
          password: "123qwe123qwe",
        };

        chai
          .request(server)
          .put("/api/user/edit")
          .set("Authorization", token)
          .send(EditUser)
          .end((err, res) => {
            res.body.should.deep.equal({
              message: "User success edited",
              user: {
                id: EditUser.id,
                block: EditUser.block,
                role: EditUser.role,
                name: EditUser.name,
                family: EditUser.family,
                surname: EditUser.surname,
                cashboxAdress: EditUser.cashboxAdress,
                email: EditUser.email,
                username: EditUser.username,
              },
              success: true,
            });
            res.should.have.status(200);
            done();
          });
      });
      it("it edit user with non password property", (done) => {
        const EditUser = {
          id: newuser._id.toString(),
          block: false,
          role: "admin",
          name: "vadim2",
          family: "tkalenko2",
          surname: "anatolievich3",
          cashboxAdress:
            "68000, Одеська обл., м. Чорноморськ, проспект Миру, буд. 29-п/1",
          email: "vadim3@gmail.com",
          username: "vadim",
        };

        chai
          .request(server)
          .put("/api/user/edit")
          .set("Authorization", token)
          .send(EditUser)
          .end((err, res) => {
            res.body.should.deep.equal({
              message: "User success edited",
              user: {
                id: newuser._id.toString(),
                block: false,
                username: "vadim",
                role: "admin",
                email: "vadim3@gmail.com",
                name: "vadim2",
                family: "tkalenko2",
                surname: "anatolievich3",
                cashboxAdress:
                  "68000, Одеська обл., м. Чорноморськ, проспект Миру, буд. 29-п/1",
              },
              success: true,
            });
            res.should.have.status(200);
            done();
          });
      });
      it("it negative test edit user with empty username", (done) => {
        const EditUser = {
          id: newuser._id.toString(),
          block: false,
          role: "admin",
          name: "vadim2",
          family: "tkalenko2",
          surname: "anatolievich3",
          cashboxAdress:
            "68000, Одеська обл., м. Чорноморськ, проспект Миру, буд. 29-п/1",
          email: "vadim3@gmail.com",
          username: "",
          password: "123qwe123qwe",
        };

        chai
          .request(server)
          .put("/api/user/edit")
          .set("Authorization", token)
          .send(EditUser)
          .end((err, res) => {
            res.body.should.deep.equal({
              message: "Validation error",
              validation: false,
              success: false,
              error: [
                {
                  value: "",
                  msg: "Поле логин не найденно",
                  param: "username",
                  location: "body",
                },
              ],
            });
            res.should.have.status(400);
            done();
          });
      });
      it("it negative test edit user with non username property", (done) => {
        const EditUser = {
          id: newuser._id.toString(),
          block: false,
          role: "admin",
          name: "vadim2",
          family: "tkalenko2",
          surname: "anatolievich3",
          cashboxAdress:
            "68000, Одеська обл., м. Чорноморськ, проспект Миру, буд. 29-п/1",
          email: "vadim3@gmail.com",
          username1: "",
          password: "123qwe123qwe",
        };

        chai
          .request(server)
          .put("/api/user/edit")
          .set("Authorization", token)
          .send(EditUser)
          .end((err, res) => {
            res.body.should.deep.equal({
              message: "Validation error",
              validation: false,
              success: false,
              error: [
                {
                  msg: "Поле логин не найденно",
                  param: "username",
                  location: "body",
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
