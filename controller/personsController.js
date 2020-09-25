const Person = require("../models/Person");
const PersonResult = require("../models/PersonFormResult");
const mongoose = require("mongoose");
/**
 * @DESC person create 1. create form result. 2 create person documen with result id
 */
const personCreate = async (Dets, res) => {
  try {
    // Validate the INN mast be uniq
    let INNNotTaken = await validateINN(Dets.result.INN);
    if (!INNNotTaken) {
      return res.status(400).json({
        message: `INN is already taken.`,
        success: false,
      });
    }

    // Validate the INN mast be uniq
    if (Dets.result.INN.toString().length != 10) {
      return res.status(400).json({
        message: `INN must have 10 digits`,
        success: false,
      });
    }

    // create a new user
    const PersonFromResult = new PersonResult({
      result: Dets.result,
    });

    const newPersonFOrmResult = await PersonFromResult.save();

    console.log(newPersonFOrmResult._id);

    const person = new Person({
      name: Dets.result.name,
      family: Dets.result.family,
      surname: Dets.result.surname ? Dets.result.surname : "",
      INN: Dets.result.INN.toString(),
      user: Dets.user,
      FormDataResultId: newPersonFOrmResult._id,
    });
    let newPerson = await person.save();

    return res.status(201).json({
      message: "Person was create",
      result: newPerson,
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
const personEdit = async (Dets, res) => {
  try {
    console.log(Dets._id);
    // Validate the username
    let INNNotTaken = await validateINN(Dets.result.INN, true);
    if (!INNNotTaken) {
      return res.status(400).json({
        message: `INN is already taken.`,
        success: false,
      });
    }

    //find person form and edit it
    await PersonResult.findOneAndUpdate(
      { _id: Dets.FormDataResultId },
      { result: Dets.result },
      {
        new: true,
        __user: Dets.user,
        __reason: `${Dets.user} updated`,
      },
      (err, doc, res) => {
        if (err) {
          console.log("error on editing form result ");
          throw err;
        }
      }
    );

    let newPerson = {
      name: Dets.result.name,
      family: Dets.result.family,
      surname: Dets.result.surname,
      INN: Dets.result.INN.toString(),
    };

    let person = await Person.findOneAndUpdate(
      { _id: Dets._id },
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
const getPersons = async (res) => {
  let persons = await Person.find();

  return res.status(201).json({
    message: "Persons get all succcesed",
    result: persons,
    success: true,
  });
};
const searchPersons = async (Dets, res) => {
  if (Dets.searchText.toString().length <= 3) {
    return res.status(400).json({
      message: "Search text must be minimum 3 letter or digit",
      success: true,
    });
  }
  console.log(Dets);
  let persons = await Person.fuzzySearch(Dets.searchText);
  // ({
  //   INN: { $regex: 123123, $options: "i" },
  //   // family: { $regex: Dets.searchText, $options: "i" },
  //   // name: { $regex: Dets.searchText, $options: "i" },
  //   // surname: { $regex: Dets.searchText, $options: "i" },
  // });
  console.log(persons);
  return res.status(201).json({
    message: "Persons get all succcesed",
    result: persons,
    success: true,
  });
};

const getPersonFormDataById = async (Dets, res) => {
  let person = await PersonResult.findOne({ _id: Dets.id });

  if (person.length == 0) {
    return res.status(400).json({
      message: `Person not found`,
      success: false,
    });
  }
  return res.status(201).json({
    message: "Person get by id succcesed",
    result: person,
    success: true,
  });
};

const validateINN = async (INN, isEdit = false) => {
  let person = await Person.find({ INN });
  if (isEdit) {
    return person.length != 1 ? false : true;
  }
  return person.length != 0 ? false : true;
};

module.exports = {
  getPersons,
  getPersonFormDataById,
  personCreate,
  personEdit,
  searchPersons,
};
