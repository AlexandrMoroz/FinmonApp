const Company = require("../models/company");
const CompanyFormData = require("../models/companyFormData");
const UserService = require("../services/user");
class CompanyService {
  constructor() {
    if (CompanyService._instance) {
      return CompanyService._instance;
    }
    CompanyService._instance = this;
  }
  async create(username, result) {
    const newForm = await new CompanyFormData({
      result: result,
    }).save();

    return await new Company({
      shortName: result.ShortName,
      clientCode: result.ClientCode,
      username: username,
      formDataResultId: newForm._id,
    }).save();
  }
  async edit(username, body) {
    let user = await UserService.getUserByUsername(username);

    await CompanyFormData.findOneAndUpdate(
      { _id: body.formDataResultId },
      { result: body.result },
      {
        new: true,
        __user: `${user.name}, ${user.family}, ${user.surname}`,
        __reason: `${username} updated`,
      }
    );
    return await Company.findOneAndUpdate(
      { _id: body._id },
      {
        shortName: body.result.ShortName,
        clientCode: body.result.ClientCode,
      },
      { new: true }
    );
  }
  async getById(id) {
    return await Company.findOne({ _id: id });
  }
  async search(searchText) {
    let res = await Company.fuzzySearch(searchText).limit(30);
    return res
      .sort((a, b) => a._doc.confidenceScore > b._doc.confidenceScore)
      .map((item) => {
        return {
          _id: item._id,
          shortName: item.shortName,
          clientCode: item.clientCode,
          username: item.username,
          formDataResultId: item.formDataResultId,
        };
      });
  }
  async getFormDataById(id) {
    return await CompanyFormData.findOne({ _id: id });
  }
  async getAllFormData() {
    let companeis = await CompanyFormData.find({});
    return companeis.map((item) => item.result);
  }
  async deleteAll() {
    await CompanyFormData.deleteMany({});
    await Company.deleteMany({});
  }
}

module.exports = new CompanyService();
