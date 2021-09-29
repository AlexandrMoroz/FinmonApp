const Form = require("../models/form");

/**
 * @description body contains name, obj of json form
 */
const Create = async (body, res, next) => {
  try {
    const newForm = await new Form({
      name: body.name,
      content: body.content,
    }).save();

    res.status(201).json({
      message: "form was create",
      result: newForm,
      success: true,
    });
  } catch (err) {
    next({ message: "Error on form create.", error: err });
  }
};
const Edit = async (body, res, next) => {
  try {
    let newForm = await Form.findOneAndUpdate(
      { _id: body.id },
      {
        name: body.name,
        content: body.content,
      },
      (err, doc, res, next) => {
        if (err) {
          throw err;
        }
      }
    );
    res.status(200).json({
      message: "Form was edite",
      result: newForm,
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    next({ message: "Error on form create.", error: err });
  }
};
const GetByName = async (body, res, next) => {
  try {
    let form = "";
    if (body.name == "personForm") {
      form = require("../mock/personForm.json");
    } else if (body.name == "companyForm") {
      form = require("../mock/companyForm.json");
    }

    // form = await Form.findOne({ name: body.name });

    res.status(200).json({
      message: "Form get by name was complited",
      result: form.content,
      success: true,
    });
  } catch (err) {
    next({ message: "Unable to get form by name.", error: err });
  }
};

module.exports = {
  Create,
  Edit,
  GetByName,
};
