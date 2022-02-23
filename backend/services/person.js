const Person = require("../models/person");
const personFormData = require("../models/personFormData");
const PersonFormData = require("../models/personFormData");
const UserService = require("./user");

class PersonService {
  constructor() {
    if (PersonService._instance) {
      return PersonService._instance;
    }
    PersonService._instance = this;
  }
  async create(username, result) {
    const newForm = await new PersonFormData({
      result: result,
    }).save();

    return await new Person({
      name: result.Name,
      family: result.Family,
      surname: result.Surname,
      INN: result.INN,
      username: username,
      formDataResultId: newForm._id,
    }).save();
  }
  async edit(username, body) {
    let user = await UserService.getUserByUsername(username);
    await PersonFormData.findOneAndUpdate(
      { _id: body.formDataResultId },
      { result: body.result },
      {
        new: true,
        __user: `${user.name}, ${user.family}, ${user.surname}`,
        __reason: `${username} updated`,
      }
    );
    return await Person.findOneAndUpdate(
      { _id: body._id },
      {
        name: body.result.Name,
        family: body.result.Family,
        surname: body.result.Surname,
        INN: body.result.INN ? body.result.INN : " ",
      },
      { new: true }
    );
  }
  async getById(id) {
    return await Person.findOne({ _id: id });
  }
  async search(searchText) {
    let res = await Person.fuzzySearch(searchText).limit(30);
    return res
      .sort((a, b) => a._doc.confidenceScore > b._doc.confidenceScore)
      .map((item) => {
        return {
          name: item.name,
          family: item.family,
          surname: item.surname,
          INN: item.INN,
          username: item.username,
          formDataResultId: item.formDataResultId,
          id: item._id,
        };
      });
  }
  async getFormDataById(id) {
    return await PersonFormData.findOne({ _id: id });
  }
  async getAllFormData() {
    let persons = await personFormData.find({});
    return persons.map((item) => item.result);
  }
  async deleteAll() {
    await PersonFormData.deleteMany({});
    await Person.deleteMany({});
  }
}

module.exports = new PersonService();
