const PersonFormData = require("./models/personFormData");
const Person = require("./models/person");
const Company = require("./models/company");
const CompanyFormData = require("./models/companyFormData");
const User = require("./models/user");
const Helper = require("./models/helper");
const bcrypt = require("bcryptjs");
const { connect } = require("mongoose");
const { devConfig } = require("./config/index");
(async function () {
  connect(devConfig.DB, {
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  });
  console.log({
    message: `Successfully connected with the Database \n${devConfig.DB}`,
    badge: true,
  });
  try {
    let seed = require("./mock/personWIthNegativeAnswers.json").result;
    let newPersonForm = await new PersonFormData({
      result: seed,
    }).save();
    await new Person({
      name: seed.Name,
      family: seed.Family,
      surname: seed.Surname ? seed.Surname : "",
      INN: seed.INN,
      username: "Alexandr",
      formDataResultId: newPersonForm._id,
    }).save();
    seed = require("./mock/companyWithNegativeAnswers.json").result;
    let newForm = await new CompanyFormData({
      result: seed,
    }).save();
    console.log(newForm)
    await new Company({
      shortName: seed.ShortName,
      clientCode: seed.ClientCode,
      username: "Alexandr",
      formDataResultId: newForm._id,
    }).save();
    await new Helper({
      name: "countries",
      result: require("./mock/countries.json").content,
    }).save();
    await new Helper({
      name: "translate",
      result: require("./mock/personTranslate.json").content,
    }).save();
    const password = await bcrypt.hash("123qwe123", 12);
    // create a new user
    let createdUser = await new User({
      block: false,
      name: "Alexandr",
      family: "Moroz",
      surname: "sergeevich1",
      cashboxAdress:
        "68000, Одеська обл., м. Чорноморськ, проспект Миру, буд. 29-п/1",
      email: "alexandr@gmail.com",
      role: "admin",
      username: "Alexandr",
      password: password,
    }).save();
  } catch (err) {
    console.log(err);
  }
})();