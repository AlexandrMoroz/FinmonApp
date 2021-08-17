const Company = require("../models/company");
const CompanyFormData = require("../models/companyFormData");
const User = require("../models/user");
const XLSXAnceta = require("../utils/anceta");
const {recursFormResult} = require("../utils/history");
const Helper = require("../models/helper");
let order = require("../mock/companyOrder.json");
/**
 * @DESC comapny create 1. create form result. 2 create person documen with result id
 * req.body: {
 *  result: {} - form data model
 *  * }
 */
const Create = async (req, res) => {
  try {
    // create a new user
    const newForm = await new CompanyFormData({
      result: req.body.result,
    }).save();

    const newCompany = await new Company({
      shortName: req.body.result.ShortName,
      clientCode: req.body.result.ClientCode,
      username: req.user.username,
      formDataResultId: newForm._id,
    }).save();
 
    return res.status(201).json({
      message: "Company was created",
      result: newCompany,
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Unable to create company.",
      success: false,
      error: err,
    });
  }
};

/**
 * @DESC To edit company credentials
 */
const Edit = async (req, res) => {
  try {

    //find person form and edit it
    await CompanyFormData.findOneAndUpdate(
      { _id: req.body.formDataResultId },
      { result: req.body.result },
      {
        new: true,
        __user: `${req.user.username}`,
        __reason: `${req.user.username} updated`,
      }
    );

    let newCompany = await Company.findOneAndUpdate(
      { _id: req.body._id },
      {
        shortName: req.body.result.ShortName,
        clientCode: req.body.result.ClientCode.toString(),
      },
      (err, doc, res) => {
        if (err) {
          throw err;
        }
      }
    );

    return res.status(200).json({
      message: "Company was edited",
      result: newCompany,
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
 * @DESC To serch company
 */
const Search = async (req, res) => {
  try {
    let companies = await Company.find({
      $or: [
        { shortName: req.query.searchText },
        { clientCode: req.query.searchText },
      ],
    });

    return res.status(200).json({
      message: "Company search succcesed",
      result: companies,
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Unable to search company.",
      success: false,
      error: err,
    });
  }
};
/**
 * @DESC To get company from data by companyFromData id
 */
const FormDataById = async (req, res) => {
  let company = await CompanyFormData.findOne({ _id: req.query.id });
  return res.status(200).json({
    message: "Company get by id succcesed",
    result: company.result,
    success: true,
  });
};


const XLMS = async (req, res) => {
  let company = await Company.findOne({ _id: req.query.id });

  let user = await User.findOne({ username: company.username });
  let formdata = await CompanyFormData.findOne({
    _id: company.formDataResultId,
  });
  
  //Sort of elemets by sort table
  let arr = recursFormResult(formdata.result, order, []);
  
  let result = {};
  arr.forEach((item) => {
    Object.entries(item).forEach(([key, value]) => {
      result[key] = value;
    });
  });
  let translate = await Helper.findOne({ name: "translate" });
  let xmls = new XLSXAnceta(translate.content);
  let buf = xmls.createFormBuf({
    title: `Анкета юридичної особи ${
      formdata.result["IsResident"] ? "Резидента" : "Не резидента"
    }`,
    user: `${user.family} ${user.name} ${user.surname}`,
    createdAt: new Date(company.createdAt).toLocaleString(),
    result,
  });
  return res.status(200).json({
    message: "Company get XLSX doc by id succcesed",
    result: buf,
    success: true,
  });
};

module.exports = {
  FormDataById,
  Create,
  Edit,
  Search,
  XLMS,
};
