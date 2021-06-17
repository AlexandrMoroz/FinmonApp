const Helper = require("../models/helper");

/**
 * @description body contains name, data: json form
 */
const Create = async (body, res) => {
  try {
    const helper = await new Helper({
      name: body.name,
      content: body.content,
    }).save();

    return res.status(201).json({
      message: "helper was create",
      result: { name: helper.name, content: helper.content },
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    return res.status(500).json({
      message: "error on create helper.",
      success: false,
      error: err,
    });
  }
};

const GetByName = async (query, res) => {
  try {
    let helper = await Helper.findOne({ name: query.name });
    return res.status(200).json({
      message: "helper get by name was complited",
      result: { name: helper.name, content: helper.content },
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Unable to get helper by name.",
      success: false,
      error: err,
    });
  }
};

module.exports = {
  Create,
  GetByName,
};
