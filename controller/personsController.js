const Person = require("../models/Person");
const PersonFormData = require("../models/PersonFormData");
const XLSXAnceta = require("../utils/anceta");
const Helper = require("../models/helper");
const { success, error } = require("consola");
const mongoose = require("mongoose");
/**
 * @DESC person create 1. create form result. 2 create person documen with result id
 * body: {
 *  result: {} - form data model
 *  user: ""
 * }
 */
const personCreate = async (body, res) => {
  try {
    // Validate the INN mast be uniq
    let INNNotTaken = await validateINN(body.result.INN);
    if (!INNNotTaken) {
      error("INN is already taken.");
      return res.status(400).json({
        message: "INN is already taken.",
        success: false,
      });
    }

    // Validate the INN mast be uniq
    if (body.result.INN.toString().length != 10) {
      error("INN must have 10 digits");
      return res.status(400).json({
        message: "INN must have 10 digits",
        success: false,
      });
    }

    // create a new user
    const newPersonForm = await new PersonFormData({
      result: body.result,
    }).save();

    const person = await new Person({
      name: body.result.name,
      family: body.result.family,
      surname: body.result.surname ? body.result.surname : "",
      INN: body.result.INN.toString(),
      user: body.user,
      FormDataResultId: newPersonForm._id,
    }).save();

    return res.status(201).json({
      message: "Person was create",
      result: person,
      success: true,
    });
  } catch (err) {
    console.log(err);
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
const personEdit = async (body, res) => {
  try {
    // Validate the username
    let INNNotTaken = await validateINN(body.result.INN, true);
    if (!INNNotTaken) {
      return res.status(400).json({
        message: `INN is already taken.`,
        success: false,
      });
    }

    //find person form and edit it
    await PersonFormData.findOneAndUpdate(
      { _id: body.FormDataResultId },
      { result: body.result },
      {
        new: true,
        __user: body.user,
        __reason: `${body.user} updated`,
      },
      (err, doc, res) => {
        if (err) {
          console.log("error on editing form result ");
          throw err;
        }
      }
    );

    let newPerson = {
      name: body.result.name,
      family: body.result.family,
      surname: body.result.surname,
      INN: body.result.INN.toString(),
    };

    let person = await Person.findOneAndUpdate(
      { _id: body._id },
      { ...newPerson },
      (err, doc, res) => {
        if (err) {
          console.log("Error on editing person");
          throw err;
        }
      }
    );
    console.log(person);
    return res.status(201).json({
      message: "Person was edite",
      result: person,
      success: true,
    });
  } catch (err) {
    console.log("Person editing finish by error");
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Unable to edit person.",
      success: false,
      error: err,
    });
  }
};

/**
 * @DESC To get all users
 */
const searchPersons = async (body, res) => {
  try {
    if (body.searchText.toString().length <= 3) {
      return res.status(400).json({
        message: "Search text must be minimum 3 letter or digit",
        success: true,
      });
    }

    let persons = await Person.find({
      $or: [
        { name: body.searchText },
        { family: body.searchText },
        { surname: body.searchText },
        { INN: body.searchText },
      ],
    });

    return res.status(201).json({
      message: "Persons get all succcesed",
      result: persons,
      success: true,
    });
  } catch (err) {
    console.log("Person search finish by error");
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
const getPersonFormDataById = async (body, res) => {
  let person = await PersonFormData.findOne({ _id: body.id });
  IfNullOrEmpty(person, res);

  return res.status(201).json({
    message: "Person get by id succcesed",
    result: person,
    success: true,
  });
};

const getPersonXLMS = async (body, res) => {
  let person = await PersonFormData.findOne({ _id: body.id });
  IfNullOrEmpty(person, res);

  let translate = await Helper.findOne({ name: "translate" });
  let xmls = new XLSXAnceta(translate.data);
  let buf = xmls.createFormBuf(person);

  return res.status(201).json({
    message: "Person get XLSX doc by id succcesed",
    result: buf,
    success: true,
  });
};

const IfNullOrEmpty = (person, res) => {
  if (person == null || !person) {
    return res.status(400).json({
      message: `Person not found`,
      success: false,
    });
  }
};

const validateINN = async (INN, isEdit = false) => {
  let person = await Person.find({ INN });
  if (isEdit) {
    return person.length != 1 ? false : true;
  }
  return person.length != 0 ? false : true;
};

module.exports = {
  getPersonFormDataById,
  personCreate,
  personEdit,
  searchPersons,
  getPersonXLMS,
};
