const chai = require("chai");
const chaihttp = require("chai-http");
const chaiExclude = require("chai-exclude");
chai.config.includeStack = true;
let XLSX = require("xlsx");

const Form = require("../models/form");

let token = "";
const user = require("../mock/adminUser.json");
chai.should();
chai.use(chaihttp);
chai.use(chaiExclude);

let test = (server) => {
  describe("test Form api", () => {
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
    describe("Form/create ", () => {
      beforeEach(async function () {
        await Form.deleteMany({});
      });

      it("it create new Form ", (done) => {
        const CreateForm = {
          name: "personForm",
          content: [
            {
              type: "tabs",
              fieldGroup: [
                {
                  templateOptions: { label: "Дати" },
                  fieldGroupClassName: "d-flex flex-wrap  align-items-end",
                  fieldGroup: [
                    {
                      className: "col-4",
                      key: "DateOfFirstSigned",
                      type: "input",
                      templateOptions: {
                        type: "date",
                        label: "Дата первинного заповнення анкети",
                      },
                    },
                    {
                      className: "col-4",
                      key: "DateOfFirstBissnesContact",
                      type: "input",
                      templateOptions: {
                        type: "date",
                        label:
                          "Дата встановлення ділових відносин / здійснення першої разової фінансової операції на значну суму",
                      },
                    },
                    {
                      className: "col-4",
                      key: "DateOffContact",
                      type: "input",
                      templateOptions: {
                        type: "date",
                        label:
                          "Дата відмови від встановлення/підтримання (розірвання) ділових (договірних) відносин",
                      },
                    },
                    {
                      className: "col-6",
                      key: "IdentificationЕype",
                      type: "select",

                      templateOptions: {
                        label:
                          "Спосіб проведення верифікації клієнта (представника клієнта)",
                        options: [
                          { label: "Особиста фізична присутність", value: 1 },
                          { label: "Режим відеотрансляції", value: 2 },
                        ],
                      },
                    },
                    {
                      className: "col-6",
                      key: "ServiceType",
                      type: "select",
                      templateOptions: {
                        label: "Види послуг, якими користується клієнт",
                        multiple: true,
                        options: [
                          { label: "Фінансовий лізинг", value: 1 },
                          { label: "Факторинг", value: 2 },
                          { label: "Надання позик", value: 3 },
                          { label: "Надання поручительств", value: 4 },
                          { label: "Надання гарантій", value: 5 },
                          {
                            label:
                              "Надання фінансових кредитів за рахунок власних коштів",
                            value: 6,
                          },
                          { label: "Обмін валют", value: 7 },
                        ],
                      },
                    },
                    {
                      className: "col-6",
                      key: "DateOfFreeze",
                      type: "repeat-one-row",
                      templateOptions: {
                        title: "Дата замороження активів",
                        cancelButtonClass: "ml-1",
                      },
                      fieldArray: {
                        fieldGroupClassName: "justify-content-center",
                        fieldGroup: [
                          {
                            key: "date",
                            type: "input",
                            templateOptions: {
                              type: "date",
                            },
                          },
                        ],
                      },
                    },
                    {
                      className: "col-6",
                      key: "DateOfUnfreeze",
                      type: "repeat-one-row",
                      templateOptions: {
                        title: "Дата розмороження активів",
                        cancelButtonClass: "ml-1",
                      },
                      fieldArray: {
                        fieldGroupClassName: "justify-content-center",
                        fieldGroup: [
                          {
                            key: "date",
                            type: "input",
                            templateOptions: {
                              type: "date",
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };
        chai
          .request(server)
          .post("/api/form/create")
          .set("Authorization", token)
          .send(CreateForm)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.result.should.excluding(["_id", "__v"]).deep.equal({
              name: CreateForm.name,
              content: CreateForm.content,
            });
            done();
          });
      });
      it("it create new Form with auth err ", (done) => {
        const CreateForm = {
          name: "personForm",
          content: [
            {
              type: "tabs",
              fieldGroup: [
                {
                  templateOptions: { label: "Дати" },
                  fieldGroupClassName: "d-flex flex-wrap  align-items-end",
                  fieldGroup: [
                    {
                      className: "col-4",
                      key: "DateOfFirstSigned",
                      type: "input",
                      templateOptions: {
                        type: "date",
                        label: "Дата первинного заповнення анкети",
                      },
                    },
                    {
                      className: "col-4",
                      key: "DateOfFirstBissnesContact",
                      type: "input",
                      templateOptions: {
                        type: "date",
                        label:
                          "Дата встановлення ділових відносин / здійснення першої разової фінансової операції на значну суму",
                      },
                    },
                    {
                      className: "col-4",
                      key: "DateOffContact",
                      type: "input",
                      templateOptions: {
                        type: "date",
                        label:
                          "Дата відмови від встановлення/підтримання (розірвання) ділових (договірних) відносин",
                      },
                    },
                    {
                      className: "col-6",
                      key: "IdentificationЕype",
                      type: "select",

                      templateOptions: {
                        label:
                          "Спосіб проведення верифікації клієнта (представника клієнта)",
                        options: [
                          { label: "Особиста фізична присутність", value: 1 },
                          { label: "Режим відеотрансляції", value: 2 },
                        ],
                      },
                    },
                    {
                      className: "col-6",
                      key: "ServiceType",
                      type: "select",
                      templateOptions: {
                        label: "Види послуг, якими користується клієнт",
                        multiple: true,
                        options: [
                          { label: "Фінансовий лізинг", value: 1 },
                          { label: "Факторинг", value: 2 },
                          { label: "Надання позик", value: 3 },
                          { label: "Надання поручительств", value: 4 },
                          { label: "Надання гарантій", value: 5 },
                          {
                            label:
                              "Надання фінансових кредитів за рахунок власних коштів",
                            value: 6,
                          },
                          { label: "Обмін валют", value: 7 },
                        ],
                      },
                    },
                    {
                      className: "col-6",
                      key: "DateOfFreeze",
                      type: "repeat-one-row",
                      templateOptions: {
                        title: "Дата замороження активів",
                        cancelButtonClass: "ml-1",
                      },
                      fieldArray: {
                        fieldGroupClassName: "justify-content-center",
                        fieldGroup: [
                          {
                            key: "date",
                            type: "input",
                            templateOptions: {
                              type: "date",
                            },
                          },
                        ],
                      },
                    },
                    {
                      className: "col-6",
                      key: "DateOfUnfreeze",
                      type: "repeat-one-row",
                      templateOptions: {
                        title: "Дата розмороження активів",
                        cancelButtonClass: "ml-1",
                      },
                      fieldArray: {
                        fieldGroupClassName: "justify-content-center",
                        fieldGroup: [
                          {
                            key: "date",
                            type: "input",
                            templateOptions: {
                              type: "date",
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };
        chai
          .request(server)
          .post("/api/form/create")
          .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")
          .send(CreateForm)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });
      it("it negative test send create new Form with mistake property name suspect validation err ", (done) => {
        const CreateForm = {
          name1: "personForm",
          content: [
            {
              type: "tabs",
              fieldGroup: [
                {
                  templateOptions: { label: "Дати" },
                  fieldGroupClassName: "d-flex flex-wrap  align-items-end",
                  fieldGroup: [
                    {
                      className: "col-4",
                      key: "DateOfFirstSigned",
                      type: "input",
                      templateOptions: {
                        type: "date",
                        label: "Дата первинного заповнення анкети",
                      },
                    },
                    {
                      className: "col-4",
                      key: "DateOfFirstBissnesContact",
                      type: "input",
                      templateOptions: {
                        type: "date",
                        label:
                          "Дата встановлення ділових відносин / здійснення першої разової фінансової операції на значну суму",
                      },
                    },
                    {
                      className: "col-4",
                      key: "DateOffContact",
                      type: "input",
                      templateOptions: {
                        type: "date",
                        label:
                          "Дата відмови від встановлення/підтримання (розірвання) ділових (договірних) відносин",
                      },
                    },
                    {
                      className: "col-6",
                      key: "IdentificationЕype",
                      type: "select",

                      templateOptions: {
                        label:
                          "Спосіб проведення верифікації клієнта (представника клієнта)",
                        options: [
                          { label: "Особиста фізична присутність", value: 1 },
                          { label: "Режим відеотрансляції", value: 2 },
                        ],
                      },
                    },
                    {
                      className: "col-6",
                      key: "ServiceType",
                      type: "select",
                      templateOptions: {
                        label: "Види послуг, якими користується клієнт",
                        multiple: true,
                        options: [
                          { label: "Фінансовий лізинг", value: 1 },
                          { label: "Факторинг", value: 2 },
                          { label: "Надання позик", value: 3 },
                          { label: "Надання поручительств", value: 4 },
                          { label: "Надання гарантій", value: 5 },
                          {
                            label:
                              "Надання фінансових кредитів за рахунок власних коштів",
                            value: 6,
                          },
                          { label: "Обмін валют", value: 7 },
                        ],
                      },
                    },
                    {
                      className: "col-6",
                      key: "DateOfFreeze",
                      type: "repeat-one-row",
                      templateOptions: {
                        title: "Дата замороження активів",
                        cancelButtonClass: "ml-1",
                      },
                      fieldArray: {
                        fieldGroupClassName: "justify-content-center",
                        fieldGroup: [
                          {
                            key: "date",
                            type: "input",
                            templateOptions: {
                              type: "date",
                            },
                          },
                        ],
                      },
                    },
                    {
                      className: "col-6",
                      key: "DateOfUnfreeze",
                      type: "repeat-one-row",
                      templateOptions: {
                        title: "Дата розмороження активів",
                        cancelButtonClass: "ml-1",
                      },
                      fieldArray: {
                        fieldGroupClassName: "justify-content-center",
                        fieldGroup: [
                          {
                            key: "date",
                            type: "input",
                            templateOptions: {
                              type: "date",
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };
        chai
          .request(server)
          .post("/api/form/create")
          .set("Authorization", token)
          .send(CreateForm)
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
                  msg: "Поле Name не найденно",
                  param: "name",
                  location: "body",
                },
              ],
            });
            done();
          });
      });
      it("it negative test send create new Form with null result suspesct validation err ", (done) => {
        const CreateForm = {
          name: "",
          content: [],
        };
        chai
          .request(server)
          .post("/api/form/create")
          .set("Authorization", token)
          .send(CreateForm)
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
                  value: "",
                  msg: "Поле Name должно содержать больше 1 символа",
                  param: "name",
                  location: "body",
                },
                {
                  value: [],
                  msg: "Поле content должнол быть массивом и содержать хотябы один елемент",
                  param: "content",
                  location: "body",
                },
              ],
            });
            done();
          });
      });
    });
    describe("Form/edit ", () => {
      let newForm;
      let oldForm;
      before(async () => {
        await Form.deleteMany({});
        oldForm = {
          name: "personForm",
          content: [
            {
              type: "tabs",
              fieldGroup: [
                {
                  templateOptions: { label: "Дати" },
                  fieldGroupClassName: "d-flex flex-wrap  align-items-end",
                  fieldGroup: [
                    {
                      className: "col-4",
                      key: "DateOfFirstSigned",
                      type: "input",
                      templateOptions: {
                        type: "date",
                        label: "Дата первинного заповнення анкети",
                      },
                    },
                    {
                      className: "col-4",
                      key: "DateOfFirstBissnesContact",
                      type: "input",
                      templateOptions: {
                        type: "date",
                        label:
                          "Дата встановлення ділових відносин / здійснення першої разової фінансової операції на значну суму",
                      },
                    },
                    {
                      className: "col-4",
                      key: "DateOffContact",
                      type: "input",
                      templateOptions: {
                        type: "date",
                        label:
                          "Дата відмови від встановлення/підтримання (розірвання) ділових (договірних) відносин",
                      },
                    },
                    {
                      className: "col-6",
                      key: "IdentificationЕype",
                      type: "select",

                      templateOptions: {
                        label:
                          "Спосіб проведення верифікації клієнта (представника клієнта)",
                        options: [
                          { label: "Особиста фізична присутність", value: 1 },
                          { label: "Режим відеотрансляції", value: 2 },
                        ],
                      },
                    },
                    {
                      className: "col-6",
                      key: "ServiceType",
                      type: "select",
                      templateOptions: {
                        label: "Види послуг, якими користується клієнт",
                        multiple: true,
                        options: [
                          { label: "Фінансовий лізинг", value: 1 },
                          { label: "Факторинг", value: 2 },
                          { label: "Надання позик", value: 3 },
                          { label: "Надання поручительств", value: 4 },
                          { label: "Надання гарантій", value: 5 },
                          {
                            label:
                              "Надання фінансових кредитів за рахунок власних коштів",
                            value: 6,
                          },
                          { label: "Обмін валют", value: 7 },
                        ],
                      },
                    },
                    {
                      className: "col-6",
                      key: "DateOfFreeze",
                      type: "repeat-one-row",
                      templateOptions: {
                        title: "Дата замороження активів",
                        cancelButtonClass: "ml-1",
                      },
                      fieldArray: {
                        fieldGroupClassName: "justify-content-center",
                        fieldGroup: [
                          {
                            key: "date",
                            type: "input",
                            templateOptions: {
                              type: "date",
                            },
                          },
                        ],
                      },
                    },
                    {
                      className: "col-6",
                      key: "DateOfUnfreeze",
                      type: "repeat-one-row",
                      templateOptions: {
                        title: "Дата розмороження активів",
                        cancelButtonClass: "ml-1",
                      },
                      fieldArray: {
                        fieldGroupClassName: "justify-content-center",
                        fieldGroup: [
                          {
                            key: "date",
                            type: "input",
                            templateOptions: {
                              type: "date",
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };
        newForm = await new Form({
          name: oldForm.name,
          content: oldForm.content,
        }).save();
      });

      it("it edit Form ", (done) => {
        const EditForm = {
          id: newForm._id,
          name: "personForm1",
          content: [
            {
              type: "tabs",
              fieldGroup: [
                {
                  templateOptions: { label: "Даты" },
                  fieldGroupClassName: "d-flex flex-wrap  align-items-end",
                  fieldGroup: [
                    {
                      className: "col-4",
                      key: "DateOfFirstSigned",
                      type: "input",
                      templateOptions: {
                        type: "date",
                        label: "Дата первинного заповнення анкети",
                      },
                    },
                    {
                      className: "col-4",
                      key: "DateOfFirstBissnesContact",
                      type: "input",
                      templateOptions: {
                        type: "date",
                        label:
                          "Дата встановлення ділових відносин / здійснення першої разової фінансової операції на значну суму",
                      },
                    },
                    {
                      className: "col-4",
                      key: "DateOffContact",
                      type: "input",
                      templateOptions: {
                        type: "date",
                        label:
                          "Дата відмови від встановлення/підтримання (розірвання) ділових (договірних) відносин",
                      },
                    },
                    {
                      className: "col-6",
                      key: "IdentificationЕype",
                      type: "select",

                      templateOptions: {
                        label:
                          "Спосіб проведення верифікації клієнта (представника клієнта)",
                        options: [
                          { label: "Особиста фізична присутність", value: 1 },
                          { label: "Режим відеотрансляції", value: 2 },
                        ],
                      },
                    },
                    {
                      className: "col-6",
                      key: "ServiceType",
                      type: "select",
                      templateOptions: {
                        label: "Види послуг, якими користується клієнт",
                        multiple: true,
                        options: [
                          { label: "Фінансовий лізинг", value: 1 },
                          { label: "Факторинг", value: 2 },
                          { label: "Надання позик", value: 3 },
                          { label: "Надання поручительств", value: 4 },
                          { label: "Надання гарантій", value: 5 },
                          {
                            label:
                              "Надання фінансових кредитів за рахунок власних коштів",
                            value: 6,
                          },
                          { label: "Обмін валют", value: 7 },
                        ],
                      },
                    },
                    {
                      className: "col-6",
                      key: "DateOfFreeze",
                      type: "repeat-one-row",
                      templateOptions: {
                        title: "Дата замороження активів",
                        cancelButtonClass: "ml-1",
                      },
                      fieldArray: {
                        fieldGroupClassName: "justify-content-center",
                        fieldGroup: [
                          {
                            key: "date",
                            type: "input",
                            templateOptions: {
                              type: "date",
                            },
                          },
                        ],
                      },
                    },
                    {
                      className: "col-6",
                      key: "DateOfUnfreeze",
                      type: "repeat-one-row",
                      templateOptions: {
                        title: "Дата розмороження активів",
                        cancelButtonClass: "ml-1",
                      },
                      fieldArray: {
                        fieldGroupClassName: "justify-content-center",
                        fieldGroup: [
                          {
                            key: "date",
                            type: "input",
                            templateOptions: {
                              type: "date",
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };
        chai
          .request(server)
          .put("/api/form/edit")
          .set("Authorization", token)
          .send(EditForm)
          .end(async (err, res) => {
            //[ { type: 'tabs', fieldGroup: [ [Object] ] } ]
            try {
              res.should.have.status(200);
              res.body.result.should.deep.equal({
                _id: EditForm.id.toString(),
                name: EditForm.name,
                content: EditForm.content,
                __v: 0,
              });
            } catch (err) {}
            if (err) {
              done(err);
            }
            done();
          });
      });
      it("it negative test edit Form with mising field", (done) => {
        const EditForm = {
          id: newForm._id,
          name1: "personForm1", //err
          content: [
            {
              type: "tabs",
              fieldGroup: [
                {
                  templateOptions: { label: "Даты" },
                  fieldGroupClassName: "d-flex flex-wrap  align-items-end",
                  fieldGroup: [
                    {
                      className: "col-4",
                      key: "DateOfFirstSigned",
                      type: "input",
                      templateOptions: {
                        type: "date",
                        label: "Дата первинного заповнення анкети",
                      },
                    },
                    {
                      className: "col-4",
                      key: "DateOfFirstBissnesContact",
                      type: "input",
                      templateOptions: {
                        type: "date",
                        label:
                          "Дата встановлення ділових відносин / здійснення першої разової фінансової операції на значну суму",
                      },
                    },
                    {
                      className: "col-4",
                      key: "DateOffContact",
                      type: "input",
                      templateOptions: {
                        type: "date",
                        label:
                          "Дата відмови від встановлення/підтримання (розірвання) ділових (договірних) відносин",
                      },
                    },
                    {
                      className: "col-6",
                      key: "IdentificationЕype",
                      type: "select",

                      templateOptions: {
                        label:
                          "Спосіб проведення верифікації клієнта (представника клієнта)",
                        options: [
                          { label: "Особиста фізична присутність", value: 1 },
                          { label: "Режим відеотрансляції", value: 2 },
                        ],
                      },
                    },
                    {
                      className: "col-6",
                      key: "ServiceType",
                      type: "select",
                      templateOptions: {
                        label: "Види послуг, якими користується клієнт",
                        multiple: true,
                        options: [
                          { label: "Фінансовий лізинг", value: 1 },
                          { label: "Факторинг", value: 2 },
                          { label: "Надання позик", value: 3 },
                          { label: "Надання поручительств", value: 4 },
                          { label: "Надання гарантій", value: 5 },
                          {
                            label:
                              "Надання фінансових кредитів за рахунок власних коштів",
                            value: 6,
                          },
                          { label: "Обмін валют", value: 7 },
                        ],
                      },
                    },
                    {
                      className: "col-6",
                      key: "DateOfFreeze",
                      type: "repeat-one-row",
                      templateOptions: {
                        title: "Дата замороження активів",
                        cancelButtonClass: "ml-1",
                      },
                      fieldArray: {
                        fieldGroupClassName: "justify-content-center",
                        fieldGroup: [
                          {
                            key: "date",
                            type: "input",
                            templateOptions: {
                              type: "date",
                            },
                          },
                        ],
                      },
                    },
                    {
                      className: "col-6",
                      key: "DateOfUnfreeze",
                      type: "repeat-one-row",
                      templateOptions: {
                        title: "Дата розмороження активів",
                        cancelButtonClass: "ml-1",
                      },
                      fieldArray: {
                        fieldGroupClassName: "justify-content-center",
                        fieldGroup: [
                          {
                            key: "date",
                            type: "input",
                            templateOptions: {
                              type: "date",
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };
        chai
          .request(server)
          .put("/api/form/edit")
          .set("Authorization", token)
          .send(EditForm)
          .end(async (err, res) => {
            res.body.should.deep.equal({
              message: "Validation error",
              validation: false,
              success: false,
              error: [
                {
                  msg: "Поле Name не найденно",
                  param: "name",
                  location: "body",
                },
              ],
            });
            res.should.have.status(400);
            if (err) {
              done(err);
            }
            done();
          });
      });
      it("it negative test edit Form with wrong Name type ", (done) => {
        const EditForm = {
          id: newForm._id,
          name: 112, //err
          content: [
            {
              type: "tabs",
              fieldGroup: [
                {
                  templateOptions: { label: "Даты" },
                  fieldGroupClassName: "d-flex flex-wrap  align-items-end",
                  fieldGroup: [
                    {
                      className: "col-4",
                      key: "DateOfFirstSigned",
                      type: "input",
                      templateOptions: {
                        type: "date",
                        label: "Дата первинного заповнення анкети",
                      },
                    },
                    {
                      className: "col-4",
                      key: "DateOfFirstBissnesContact",
                      type: "input",
                      templateOptions: {
                        type: "date",
                        label:
                          "Дата встановлення ділових відносин / здійснення першої разової фінансової операції на значну суму",
                      },
                    },
                    {
                      className: "col-4",
                      key: "DateOffContact",
                      type: "input",
                      templateOptions: {
                        type: "date",
                        label:
                          "Дата відмови від встановлення/підтримання (розірвання) ділових (договірних) відносин",
                      },
                    },
                    {
                      className: "col-6",
                      key: "IdentificationЕype",
                      type: "select",

                      templateOptions: {
                        label:
                          "Спосіб проведення верифікації клієнта (представника клієнта)",
                        options: [
                          { label: "Особиста фізична присутність", value: 1 },
                          { label: "Режим відеотрансляції", value: 2 },
                        ],
                      },
                    },
                    {
                      className: "col-6",
                      key: "ServiceType",
                      type: "select",
                      templateOptions: {
                        label: "Види послуг, якими користується клієнт",
                        multiple: true,
                        options: [
                          { label: "Фінансовий лізинг", value: 1 },
                          { label: "Факторинг", value: 2 },
                          { label: "Надання позик", value: 3 },
                          { label: "Надання поручительств", value: 4 },
                          { label: "Надання гарантій", value: 5 },
                          {
                            label:
                              "Надання фінансових кредитів за рахунок власних коштів",
                            value: 6,
                          },
                          { label: "Обмін валют", value: 7 },
                        ],
                      },
                    },
                    {
                      className: "col-6",
                      key: "DateOfFreeze",
                      type: "repeat-one-row",
                      templateOptions: {
                        title: "Дата замороження активів",
                        cancelButtonClass: "ml-1",
                      },
                      fieldArray: {
                        fieldGroupClassName: "justify-content-center",
                        fieldGroup: [
                          {
                            key: "date",
                            type: "input",
                            templateOptions: {
                              type: "date",
                            },
                          },
                        ],
                      },
                    },
                    {
                      className: "col-6",
                      key: "DateOfUnfreeze",
                      type: "repeat-one-row",
                      templateOptions: {
                        title: "Дата розмороження активів",
                        cancelButtonClass: "ml-1",
                      },
                      fieldArray: {
                        fieldGroupClassName: "justify-content-center",
                        fieldGroup: [
                          {
                            key: "date",
                            type: "input",
                            templateOptions: {
                              type: "date",
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };
        chai
          .request(server)
          .put("/api/form/edit")
          .set("Authorization", token)
          .send(EditForm)
          .end(async (err, res) => {
            res.body.should.deep.equal({
              message: "Validation error",
              validation: false,
              success: false,
              error: [
                {
                  value: 112,
                  msg: "Поле Name должнол быть строкой",
                  param: "name",
                  location: "body",
                },
              ],
            });
            res.should.have.status(400);
            if (err) {
              done(err);
            }
            done();
          });
      });
      it("it negative test edit Form with empty Name ", (done) => {
        const EditForm = {
          id: newForm._id,
          name: "", //err
          content: [
            {
              type: "tabs",
              fieldGroup: [
                {
                  templateOptions: { label: "Даты" },
                  fieldGroupClassName: "d-flex flex-wrap  align-items-end",
                  fieldGroup: [
                    {
                      className: "col-4",
                      key: "DateOfFirstSigned",
                      type: "input",
                      templateOptions: {
                        type: "date",
                        label: "Дата первинного заповнення анкети",
                      },
                    },
                    {
                      className: "col-4",
                      key: "DateOfFirstBissnesContact",
                      type: "input",
                      templateOptions: {
                        type: "date",
                        label:
                          "Дата встановлення ділових відносин / здійснення першої разової фінансової операції на значну суму",
                      },
                    },
                    {
                      className: "col-4",
                      key: "DateOffContact",
                      type: "input",
                      templateOptions: {
                        type: "date",
                        label:
                          "Дата відмови від встановлення/підтримання (розірвання) ділових (договірних) відносин",
                      },
                    },
                    {
                      className: "col-6",
                      key: "IdentificationЕype",
                      type: "select",

                      templateOptions: {
                        label:
                          "Спосіб проведення верифікації клієнта (представника клієнта)",
                        options: [
                          { label: "Особиста фізична присутність", value: 1 },
                          { label: "Режим відеотрансляції", value: 2 },
                        ],
                      },
                    },
                    {
                      className: "col-6",
                      key: "ServiceType",
                      type: "select",
                      templateOptions: {
                        label: "Види послуг, якими користується клієнт",
                        multiple: true,
                        options: [
                          { label: "Фінансовий лізинг", value: 1 },
                          { label: "Факторинг", value: 2 },
                          { label: "Надання позик", value: 3 },
                          { label: "Надання поручительств", value: 4 },
                          { label: "Надання гарантій", value: 5 },
                          {
                            label:
                              "Надання фінансових кредитів за рахунок власних коштів",
                            value: 6,
                          },
                          { label: "Обмін валют", value: 7 },
                        ],
                      },
                    },
                    {
                      className: "col-6",
                      key: "DateOfFreeze",
                      type: "repeat-one-row",
                      templateOptions: {
                        title: "Дата замороження активів",
                        cancelButtonClass: "ml-1",
                      },
                      fieldArray: {
                        fieldGroupClassName: "justify-content-center",
                        fieldGroup: [
                          {
                            key: "date",
                            type: "input",
                            templateOptions: {
                              type: "date",
                            },
                          },
                        ],
                      },
                    },
                    {
                      className: "col-6",
                      key: "DateOfUnfreeze",
                      type: "repeat-one-row",
                      templateOptions: {
                        title: "Дата розмороження активів",
                        cancelButtonClass: "ml-1",
                      },
                      fieldArray: {
                        fieldGroupClassName: "justify-content-center",
                        fieldGroup: [
                          {
                            key: "date",
                            type: "input",
                            templateOptions: {
                              type: "date",
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          ],
        };
        chai
          .request(server)
          .put("/api/form/edit")
          .set("Authorization", token)
          .send(EditForm)
          .end(async (err, res) => {
            res.body.should.deep.equal({
              message: "Validation error",
              validation: false,
              success: false,
              error: [
                {
                  value: "",
                  msg: "Поле Name должно содержать больше 1 символа",
                  param: "name",
                  location: "body",
                },
              ],
            });
            res.should.have.status(400);
            if (err) {
              done(err);
            }
            done();
          });
      });
    });

    describe("Form/getByName", () => {
      let newForm;
      let oldForm;
      before(async () => {
        await Form.deleteMany({});
        oldForm = require("../mock/personForm.json");
        newForm = await new Form({
          name: oldForm.name,
          content: oldForm.content,
        }).save();
      });
      it("it get Form by name", (done) => {
        chai
          .request(server)
          .get("/api/form/")
          .set("Authorization", token)
          .query({ name: newForm.name })
          .end(async (err, res) => {
            res.should.have.status(200);
            res.body.should.deep.equal({
              message: "Form get by name was complited",
              result: newForm.content,
              success: true,
            });
            done();
          });
      });
      it("it negative test get form form data by id with wrong id", (done) => {
        chai
          .request(server)
          .get("/api/form/")
          .set("Authorization", token)
          .query({ name: "personForm1" }) //wrong id
          .end(async (err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("message").eql("Validation error");
            res.body.should.have.property("validation").eql(false);
            res.body.should.have.property("error").deep.equal([
              {
                value: "personForm1",
                msg: "Форма не найденна",
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
      it("it negative test get Person form data by id with empty id", (done) => {
        chai
          .request(server)
          .get("/api/form/")
          .set("Authorization", token)
          .query({ name: "" }) //wrong id
          .end(async (err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("message").eql("Validation error");
            res.body.should.have.property("validation").eql(false);
            res.body.should.have.property("error").deep.equal([
              {
                value: "",
                msg: "Поле Name должно содержать больше 1 символа",
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
    });
  });
};
module.exports = test;
