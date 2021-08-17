const Form = require("../models/form");

/**
 * @description body contains name, obj of json form
 */
const Create = async (body, res) => {
  try {
    const newForm = await new Form({
      name: body.name,
      content: body.content,
    }).save();

    return res.status(201).json({
      message: "form was create",
      result: newForm,
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Error on form create.",
      success: false,
      error: err,
    });
  }
};
const Edit = async (body, res) => {
  try {
    let newForm = await Form.findOneAndUpdate(
      { _id: body.id },
      {
        name: body.name,
        content: body.content,
      },
      (err, doc, res) => {
        if (err) {
          throw err;
        }
      }
    );

    return res.status(200).json({
      message: "Form was edite",
      result: newForm,
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Unable to edit form.",
      success: false,
      error: err,
    });
  }
};
const GetByName = async (body, res) => {
  try {
    let form = "";
    if (body.name == "personForm") {
      form = require("../mock/personForm.json");
    } else if (body.name == "companyForm") {
      form = require("../mock/companyForm.json");
    }
    
    // form = await Form.findOne({ name: body.name });

    return res.status(200).json({
      message: "Form get by name was complited",
      result: form.content,
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Unable to get form by name.",
      success: false,
      error: err,
    });
  }
};

module.exports = {
  Create,
  Edit,
  GetByName,
};
