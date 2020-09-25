const FOP = require("../models/FOP");
const FOPResult = require("../models/FOPFormResult");
const mongoose = require("mongoose");
/**
 * @DESC FOP create 1. create form result. 2 create FOP documen with result id
 */
const FOPCreate = async (FOPDets, res) => {
  try {
    // Validate the INN mast be uniq
    let INNNotTaken = await validateINN(FOPDets.INN);
    if (!INNNotTaken) {
      return res.status(400).json({
        message: `INN is already taken.`,
        success: false,
      });
    }

    // Validate the INN mast be uniq
    if (FOPDets.INN.toString().length != 10) {
      return res.status(400).json({
        message: `INN must have 10 digits`,
        success: false,
      });
    }

    const FOPFromResult = new FOPResult({
      result: FOPDets,
    });

    const newFOPFormResult = await FOPFromResult.save();

    console.log(newFOPFormResult._id);

    const fop = new FOP({
      name: FOPDets.name,
      family: FOPDets.family,
      surname: FOPDets.surname ? FOPDets.surname : "",
      INN: FOPDets.INN,
      FormDataResultId: newFOPFormResult._id,
    });
    let newfop = await fop.save();

    return res.status(201).json({
      message: "FOP was create",
      result:newfop,
      success: true,
    });
  } catch (err) {
    console.log(err);
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Unable to create FOP.",
      success: false,
      error: err,
    });
  }
};

/**
 * @DESC To edit the FOP
 */
const FOPEdit = async (FOPDets, res) => {
  try {
    // Validate the username
    let INNNotTaken = await validateINN(FOPDets.result.INN, true);
    if (!INNNotTaken) {
      return res.status(400).json({
        message: `INN is already taken.`,
        success: false,
      });
    }

    //find FOP form and edit it
    await FOPResult.findOneAndUpdate(
      { _id: FOPDets.FormDataResultId },
      { result: FOPDets.result },
      (err, doc, res) => {
        if (err) {
          console.log("error on editing form result ");
          throw err;
        }
      }
    );

    let newFOP = {
      name: FOPDets.result.name,
      family: FOPDets.result.family,
      surname: FOPDets.result.surname,
      INN: FOPDets.result.INN,
    };

    let fop = await FOP.findOneAndUpdate(
      { _id: FOPDets._id },
      {...newFOP},
      (err, doc, res) => {
        if (err) {
          console.log("Error on editing FOP");
          throw err;
        }
      }
    );

    return res.status(201).json({
      message: "FOP was edite",
      result:fop,
      success: true,
    });
  } catch (err) {
    console.log("FOP editing finish by error");
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Unable to edit FOP.",
      success: false,
      error: err,
    });
  }
};

/**
 * @DESC To get all FOP
 */
const getFOPs = async (res) => {
  let FOPs = await FOP.find();

  return res.status(201).json({
    message: "FOPs get all succcesed",
    result:FOPs,
    success: true,
  });
};

const getFOPFormDataById = async (FOPDets, res) => {
  let fop = await FOPResult.findOne({ _id: FOPDets.id });

  if (fop.length == 0) {
    return res.status(400).json({
      message: `FOP not found`,
      success: false,
    });
  }
  return res.status(201).json({
    message: "FOP get by id succcesed",
    result: fop,
    success: true,
  });
};

const validateINN = async (INN, isEdit = false) => {
  let fop = await FOP.find({ INN });
  if (isEdit) {
    return fop.length != 1 ? false : true;
  }
  return fop.length != 0 ? false : true;
};

module.exports = {
  getFOPs,
  getFOPFormDataById,
  FOPCreate,
  FOPEdit,
};
