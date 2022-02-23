const chai = require("chai");
const chaihttp = require("chai-http");
const chaiExclude = require("chai-exclude");
chai.config.includeStack = true;
const userService = require("../services/user");

let token = "";
const user = require("../mock/adminUser.json");

let newuser;
chai.should();
chai.use(chaihttp);
chai.use(chaiExclude);

let test = (server) => {
  describe("test user api", () => {
    describe("user/create ", () => {
      before(async () => {
        try {
          await userService.deleteAll();
          newuser = await userService.create(user);

          let res = await chai.request(server).post("/api/user/login").send({
            username: user.username,
            password: user.password,
          });
          token = res.body.token;
        } catch (err) {
          console.log(err);
        }
      });
      it("it create new user", async () => {
        const CreateUser = {
          block: false,
          role: "admin",
          name: "vadim",
          family: "tkalenko",
          surname: "anatolievich",
          cashboxAdress:
            "68000, Одеська обл., м. Чорноморськ, проспект Миру, буд. 29-п/1",
          email: "vadim@gmail.com",
          username: "vadim",
          password: "123qwe123qwe",
        };
        let res = await chai
          .request(server)
          .post("/api/user/create")
          .set("Authorization", token)
          .send(CreateUser);

        delete CreateUser.password;
        res.body.result.should
          .excluding(["id", "password"])
          .deep.equal(CreateUser);
        res.should.have.status(201);
      });
      it("it create new user with auth err ", async () => {
        const CreateUser = {
          block: false,
          role: "admin",
          name: "vadim",
          family: "tkalenko",
          surname: "anatolievich",
          cashboxAdress:
            "68000, Одеська обл., м. Чорноморськ, проспект Миру, буд. 29-п/1",
          email: "vadim@gmail.com",
          username: "vadim",
          password: "123qwe123qwe",
        };
        let res = await chai
          .request(server)
          .post("/api/user/create")
          .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
          .send(CreateUser);

        res.should.have.status(401);
      });
      it("it negative test send create new user with mistake property name suspect username not found validation err ", async () => {
        const CreateUser = {
          block: false,
          role: "admin",
          name: "vadim",
          family: "tkalenko",
          surname: "anatolievich",
          cashboxAdress:
            "68000, Одеська обл., м. Чорноморськ, проспект Миру, буд. 29-п/1",
          email: "vadim@gmail.com",
          username1: "vadim", //err
          password: "123qwe123qwe",
        };
        let res = await chai
          .request(server)
          .post("/api/user/create")
          .set("Authorization", token)
          .send(CreateUser);

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
      });
      it("it negative test send create new user with mistake property name suspect username unique validation err ", async () => {
        const CreateUser = {
          block: false,
          role: "admin",
          name: "vadim",
          family: "tkalenko",
          surname: "anatolievich",
          cashboxAdress:
            "68000, Одеська обл., м. Чорноморськ, проспект Миру, буд. 29-п/1",
          email: "vadim@gmail.com",
          username: "vadim", //err
          password: "123qwe123qwe",
        };
        let res = await chai
          .request(server)
          .post("/api/user/create")
          .set("Authorization", token)
          .send(CreateUser);

        res.should.have.status(400);
        res.body.should.deep.equal({
          message: "Validation error",
          validation: false,
          success: false,
          error: [
            {
              value: "vadim",
              msg: "Логин уже используется",
              param: "username",
              location: "body",
            },
          ],
        });
      });
      it("it negative test send create new helper with null result suspesct validation err ", async () => {
        const CreateUser = {};
        let res = await chai
          .request(server)
          .post("/api/user/create")
          .set("Authorization", token)
          .send(CreateUser);

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
      });
    });

    describe("user/edit", () => {
      let newCreatedUser;
      beforeEach(async () => {
        try {
          await userService.deleteAll();
          newuser = await userService.create(user);

          let res = await chai.request(server).post("/api/user/login").send({
            username: user.username,
            password: user.password,
          });
          token = res.body.token;

          res = await chai
            .request(server)
            .post("/api/user/create")
            .set("Authorization", token)
            .send({
              block: false,
              role: "admin",
              name: "vadim23",
              family: "tkalenko23",
              surname: "anatolievich23",
              cashboxAdress:
                "68000, Одеська обл., м. Чорноморськ, проспект Миру, буд. 29-п/1",
              email: "vadim@gmail.com",
              username: "vadim23",
              password: "123qwe123qwe",
            });
          newCreatedUser = res.body.result;
        } catch (err) {
          console.log(err);
        }
      });
      it("it edit user", async () => {
        const EditUser = {
          id: newCreatedUser.id.toString(),
          block: false,
          role: "admin",
          name: "vadim2",
          family: "tkalenko2",
          surname: "anatolievich2",
          cashboxAdress:
            "68000, Одеська обл., м. Чорноморськ, проспект Миру, буд. 29-п/1",
          email: "vadim3@gmail.com",
          username: "vadim2",
          password: "123qwe123qwe",
        };
        let res = await chai
          .request(server)
          .put("/api/user/edit")
          .set("Authorization", token)
          .send(EditUser);

        res.body.should.deep.equal({
          message: "User success edited",
          result: {
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
      });
      it("it edit user with non password property", async () => {
        const EditUser = {
          id: newCreatedUser.id.toString(),
          block: false,
          role: "admin",
          name: "vadim2",
          family: "tkalenko2",
          surname: "anatolievich3",
          cashboxAdress:
            "68000, Одеська обл., м. Чорноморськ, проспект Миру, буд. 29-п/1",
          email: "vadim3@gmail.com",
          username: "vadim1",
        };

        let res = await chai
          .request(server)
          .put("/api/user/edit")
          .set("Authorization", token)
          .send(EditUser);

        res.body.should.deep.equal({
          message: "User success edited",
          result: {
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
      });
      it("it negative test edit user with empty username", async () => {
        const EditUser = {
          id: newCreatedUser.id.toString(),
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
        let res = await chai
          .request(server)
          .put("/api/user/edit")
          .set("Authorization", token)
          .send(EditUser);

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
      });
      it("it negative test edit user with non username property", async () => {
        const EditUser = {
          id: newCreatedUser.id.toString(),
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
        try {
          let res = await chai
            .request(server)
            .put("/api/user/edit")
            .set("Authorization", token)
            .send(EditUser);
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
        } catch (err) {
          console.log(err);
        }
      });
    });
  });
};
module.exports = test;
