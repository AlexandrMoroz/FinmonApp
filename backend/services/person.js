const Person = require("../models/person");
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
      family: result.Name,
      name: result.Family,
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
        shortName: body.result.ShortName,
        clientCode: body.result.ClientCode,
      }
    );
  }
  async getById(id) {
    return await Person.findOne({ _id: id });
  }
  async search(searchText) {
    return await Person.find({
      $or: [
        { name: searchText },
        { family: searchText },
        { surname: searchText },
        { INN: searchText },
      ],
    });
  }
  async getFormDataById(id) {
    return (await PersonFormData.findOne({ _id: id }));
  }
}

module.exports = new PersonService();