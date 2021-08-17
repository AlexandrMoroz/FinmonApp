const Person = require("../models/person");
const PersonFormData = require("../models/personFormData");
const User = require("../models/user");
const XLSXAnceta = require("../utils/anceta");
const {recursFormResult} = require("../utils/history");
const Helper = require("../models/helper");
let order = require("../mock/personOrder.json");

/**
 * @DESC person create 1. create form result. 2 create person documen with result id
 * req.body: {
 *  result: {} - form data model
 *  user: ""
 * }
 */
const Create = async (req, res) => {
  try {
    // create a new user
    const newPersonForm = await new PersonFormData({
      result: req.body.result,
    }).save();

    const person = await new Person({
      name: req.body.result.Name,
      family: req.body.result.Family,
      surname: req.body.result.Surname ? req.body.result.Surname : "",
      INN: req.body.result.INN,
      username: req.user.username,
      formDataResultId: newPersonForm._id,
    }).save();

    return res.status(201).json({
      message: "Person was create",
      result: person,
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Unable to create person.",
      success: false,
      error: err,
    });
  }
};

/**
 * @DESC To edit the person
 */
const Edit = async (req, res) => {
  try {
    //find person form and edit it
    await PersonFormData.findOneAndUpdate(
      { _id: req.body.formDataResultId },
      { result: req.body.result },
      {
        new: true,
        __user: `${req.user.name} ${req.user.family} ${req.user.surname}`,
        __reason: `${req.body.user} updated`,
      }
    );
     let newPerson = {
      name: req.body.result.Name,
      family: req.body.result.Family,
      surname: req.body.result.Surname ? req.body.result.Surname : "",
      INN: req.body.result.INN,
    };

    let person = await Person.findOneAndUpdate(
      { _id: req.body._id },
      { ...newPerson },
      (err, doc, res) => {
        if (err) {
          throw err;
        }
      }
    );

    return res.status(200).json({
      message: "Person was edited",
      result: person,
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Unable to edit person.",
      success: false,
      error: err,
    });
  }
};

/**
 * @DESC
 */
const Search = async (req, res) => {
  try {
    let persons = await Person.find({
      $or: [
        { name: req.query.searchText },
        { family: req.query.searchText },
        { surname: req.query.searchText },
        { INN: req.query.searchText },
      ],
    });

    return res.status(200).json({
      message: "Persons get all succcesed",
      result: persons,
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Unable to search person.",
      success: false,
      error: err,
    });
  }
};
/**
 * @DESC To get person from data by personFromData id
 */
const FormDataById = async (req, res) => {
  try {
    let person = await PersonFormData.findOne({ _id: req.query.id });

    return res.status(200).json({
      message: "Person get by id succcesed",
      result: person.result,
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Unable to search person.",
      success: false,
      error: err,
    });
  }
};


/**
 * @DESC To get person from data.
 * req.body: {
 *  id:123123123
 * }
 * id of person collection
 */
const XLMS = async (req, res) => {
  try {
    let person = await Person.findOne({ _id: req.query.id });
    let user = await User.findOne({ username: person.username });
    let formdata = await PersonFormData.findOne({
      _id: person.formDataResultId,
    });
    // reorganize EmploymentType arr if it has "найманий працівник" by replace it with obj {найманий працівник:EmploymentTypeDescribe}
    if (
      formdata.result["EmploymentType"] &&
      formdata.result["EmploymentTypeDescribe"]
    ) {
      formdata.result = {
        ...formdata.result,
        EmploymentType: formdata.result["EmploymentType"].map((item) => {
          if (item == "найманий працівник") {
            return { [item]: formdata.result["EmploymentTypeDescribe"] };
          }
          return item;
        }),
      };
    }
    //Sort of elemets by sort table
    let arr = recursFormResult(formdata.result, order, []);
    let result = {};
    arr.forEach((item) => {
      Object.entries(item).forEach(([key, value]) => {
        result[key] = value;
      });
    });
    //console.log(result);
    let translate = await Helper.findOne({ name: "translate" });
    let xmls = new XLSXAnceta(translate.content);

    let buf = xmls.createFormBuf({
      title: `Анкета фізичной особи ${
        formdata.result["IsResident"] ? "Резидента" : "Не резидента"
      }`,
      user: `${user.family} ${user.name} ${user.surname}`,
      createdAt: new Date(person.createdAt).toLocaleString("en-GB"),
      result,
    });
    return res.status(200).json({
      message: "Person get XLSX doc by id succcesed",
      result: buf,
      success: true,
    });
  } catch (err) {
    console.log(err);
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Unable get file from person.",
      success: false,
      error: err,
    });
  }
};

module.exports = {
  FormDataById,
  Create,
  Edit,
  Search,
  XLMS,
};
