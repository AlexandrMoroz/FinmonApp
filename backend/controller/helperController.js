const HelperService = require("../services/helper");
/**
 * @description body contains name, data: json form
 */
const Create = async (body, res, next) => {
  try {
    const helper = await HelperService.create(body.name, body.result);

    res.status(201).json({
      message: "helper was create",
      result: { name: helper.name, result: helper.result },
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    next({ message: "Error on create helper.", error: err });
  }
};

const GetByName = async (query, res, next) => {
  try {
    let helper = await HelperService.getByName(query.name);
    res.status(200).json({
      message: "helper get by name was complited",
      result: helper,
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    next({ message: "Unable to get helper by name.", error: err });
  }
};

module.exports = {
  Create,
  GetByName,
};
