const personTerror = require("../models/personTerrorist");
const companyTerror = require("../models/companyTerrorist");
const personSanction = require("../models/personSanction");
const companySanction = require("../models/companySanction");
const Sanction = new require("../services/sanction");
const Terrorist = require("../services/terrorist");
let sanctionService = new Sanction();
let terroristService = new Terrorist();

const CompanySearch = async (body, res, next) => {
  try {
    let sanction = sanctionService.searchCompany(body.searchText);
    let terror = terroristService.searchCompany(body.searchText);
    res.status(200).json({
      message: "Company outer base search complite",
      result: {
        terror,
        sanction: sanction.map((item) => sanctionSerialize(item)),
      },
      success: true,
    });
  } catch (err) {
    next({ message: "Company outerbase search error.", error: err });
  }
};

const PersonSearch = async (query, res, next) => {
  try {
    let sanction = await sanctionService.searchPerson(query.searchText);
    let terror = await terroristService.searchPerson(query.searchText);
    res.status(200).json({
      message: "Person outer base search complite",
      result: {
        terror,
        sanction: sanction.map((item) => {
          return sanctionSerialize(item);
        }),
      },
      success: true,
    });
  } catch (err) {
    next({ message: "Person outerbase search error.", error: err });
  }
};

let sanctionSerialize = (model) => {
  return {
    birthdate: model.birthdate,
    confidenceScore: model.confidenceScore,
    name_original: model.name_original,
    name_ukr: model.name_ukr,
  };
};
module.exports = {
  CompanySearch,
  PersonSearch,
};
