const Helper = require("../models/helper");

/**
 * @description body contains name, data: json form
 */
const Create = async (body, res, next) => {
  try {
    const helper = await new Helper({
      name: body.name,
      content: body.content,
    }).save();

    res.status(201).json({
      message: "helper was create",
      result: { name: helper.name, content: helper.content },
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    next({ message: "Error on create helper.", error: err });
  }
};

const GetByName = async (query, res, next) => {
  try {
    let helper = await Helper.findOne({ name: query.name });
    res.status(200).json({
      message: "helper get by name was complited",
      result: helper.content,
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
