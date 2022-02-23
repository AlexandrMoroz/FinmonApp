const User = require("../models/user");
const XLSXAnceta = require("../utils/anceta");
const { recursFormResult } = require("../utils/history");
const HelperService = require("./helper");
const { COMPANY, PERSON, getService } = require("./serviceshelpers");

class XLSXService {
  constructor() {
    if (XLSXService._instance) {
      return XLSXService._instance;
    }
    XLSXService._instance = this;
  }

  getAncetaType(ServiceType) {
    switch (ServiceType) {
      case COMPANY:
        return "Юридичної";
      case PERSON:
        return "Фізичної";
    }
  }
  async getDocument(ServiceType, id) {
    let service = getService(ServiceType);

    let model = await service.getById(id);

    let user = await User.findOne({ username: model.username });
    let formdata = await service.getFormDataById(model.formDataResultId);
    let order = await HelperService.getOrder(ServiceType);
    //Sort of elemets by sort table
    let arr = recursFormResult(formdata.result, order, []);

    let result = {};
    arr.forEach((item) => {
      Object.entries(item).forEach(([key, value]) => {
        result[key] = value;
      });
    });
    let translate = await HelperService.getTranslate();

    let xmls = new XLSXAnceta(translate);

    return xmls.createFormBuf({
      title: `Анкета ${this.getAncetaType(ServiceType)} особи ${
        formdata["IsResident"] ? "Резидента" : "Не резидента"
      }`,
      user: `${user.family} ${user.name} ${user.surname}`,
      createdAt: new Date(model.createdAt).toLocaleString("en-GB"),
      result,
    });
  }
}

module.exports = new XLSXService();
