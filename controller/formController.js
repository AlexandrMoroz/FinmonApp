const Form = require("../models/Form");

/**
 * @description body contains name, obj of json form
 */
const formCreate = async (body, res) => {
  try {
    // Validate the INN mast be uniq
    let NameNotTaken = await validateFormName(body.name);
    if (!NameNotTaken) {
      return res.status(400).json({
        message: `form name is already taken.`,
        success: false,
      });
    }

    const form = new Form({
      name: body.name,
      content: body.content,
    });

    let newForm = await form.save();

    return res.status(201).json({
      message: "form was create",
      result: newForm,
      success: true,
    });
  } catch (err) {
    console.log(err);
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Error on form create.",
      success: false,
      error: err,
    });
  }
};
const formEdit = async (body, res) => {
  try {
    // Validate the username
    let NameNotTaken = await validateFormName(body.name);
    if (!NameNotTaken) {
      return res.status(400).json({
        message: `form name is already taken.`,
        success: false,
      });
    }

    const newForm = Form({
      name: body.name,
      content: body.content,
    });

    await newForm.findOneAndUpdate(
      { _id: body._id },
      { newForm },
      (err, doc, res) => {
        if (err) {
          console.log("error on editing form ");
          throw err;
        }
      }
    );

    return res.status(201).json({
      message: "Form was edite",
      result: newForm,
      success: true,
    });
  } catch (err) {
    console.log("Form editing finish by error");
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Unable to edit form.",
      success: false,
      error: err,
    });
  }
};

const formGetByName = async (body, res) => {
  try {
    // let form = await Form.findOne({ name: body.name });
    // if (!form) {
    //   return res.status(400).json({
    //     message: `Can't find form name.`,
    //     success: false,
    //   });
    // }
    let form = "";
    console.log(body.name)
    if (body.name == "personForm") {
      form = require("../mock/personForm.json");
    } else if (body.name == "companyForm") {
      form = require("../mock/companyForm.json");
    }

    return res.status(201).json({
      message: "Form get by name was complited",
      result: form.content,
      success: true,
    });
  } catch (err) {
    console.log("Form get by name finish by error");
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Unable to get form by name.",
      success: false,
      error: err,
    });
  }
};

const validateFormName = async (name, isEdit = false) => {
  let form = await Form.find({ name });
  if (isEdit) {
    return form.length != 1 ? false : true;
  }
  return form.length != 0 ? false : true;
};

module.exports = {
  formCreate,
  formEdit,
  formGetByName,
};
