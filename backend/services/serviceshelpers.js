const COMPANY = "COMPANY";
const PERSON = "PERSON";
const CompanyService = require("../services/company");
const PersonService = require("../services/person");

module.exports = {
  COMPANY,
  PERSON,
  getService(ServiceType) {
    switch (ServiceType) {
      case COMPANY:
        return CompanyService;
      case PERSON:
        return PersonService;
    }
  },
};
