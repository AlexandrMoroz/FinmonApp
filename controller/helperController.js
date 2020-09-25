const Helper = require("../models/Helper");

/**
 * @description helperDets contains name, data: json form
 */
const helperCreate = async (helperDets, res) => {
  try {
    // Validate the INN mast be uniq
    let NameNotTaken = await validateName(helperDets.name);
    if (!NameNotTaken) {
      return res.status(400).json({
        message: `helper name is already taken.`,
        success: false,
      });
    }
    const helper = new Helper({
      name: helperDets.name,
      data: helperDets.data,
    });

    let newhelper = await helper.save();

    return res.status(201).json({
      message: "helper was create",
      result: newhelper,
      success: true,
    });
  } catch (err) {
    console.log(err);
    // Implement logger function (winston)
    return res.status(500).json({
      message: "error on create helper.",
      success: false,
      error: err,
    });
  }
};

const helperGetByName = async (helperDets, res) => {
  try {
    console.log(helperDets.name);
    let helper = await Helper.findOne({ name: helperDets.name });

    if (!helper) {
      return res.status(400).json({
        message: `Can't find helpers name.`,
        success: false,
      });
    }
    return res.status(201).json({
      message: "helper get by name was complited",
      result: { name: helper.name, data: helper.data },
      success: true,
    });
  } catch (err) {
    console.log("helper get by name finish by error");
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Unable to get helper by name.",
      success: false,
      error: err,
    });
  }
};

const validateName = async (name) => {
  let helper = await Helper.find({ name });
  return helper.length != 0 ? false : true;
};

module.exports = {
  helperCreate,
  helperGetByName,
};
