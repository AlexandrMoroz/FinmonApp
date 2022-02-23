const personSanction = require("../models/personSanction");
const companySanction = require("../models/companySanction");
const axios = require("axios");

class SanctionService {
  constructor() {
    this.personsSanctionUrl = "https://sanctions-t.rnbo.gov.ua/api/fizosoba/";
    this.companySanctionUrl = "https://sanctions-t.rnbo.gov.ua/api/jurosoba/";
  }
  async updatePersonFromSite() {
    try {
      let res = await axios.get(this.personsSanctionUrl);
      console.log("Sanction person update start");

      if (res.status == 200) {
        await personSanction.deleteMany({});
        await personSanction.insertMany(res.data);
        console.log("Sanction person update over");
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  async updateCompanyFromSite() {
    try {
      let res = await axios.get(this.companySanctionUrl);
      if (res.status == 200) {
        console.log("Sanction Company update start");
        await companySanction.deleteMany({});
        await companySanction.insertMany(
          res.data.map((item) => {
            let odrn_edrpou = item.odrn_edrpou
              ? item.odrn_edrpou.replace("ОДРН", "")
              : null;
            let ipn = item.ipn ? item.ipn.replace("ІПН", "") : null;
            return { ...item, odrn_edrpou, ipn };
          })
        );
        console.log("Sanction Company update over");
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  async updateFromSite() {
    let arr = [
      await this.updateCompanyFromSite(),
      await this.updatePersonFromSite(),
    ];

    return !arr.includes(false);
  }
  async searchPerson(name) {
    let res = await personSanction.fuzzySearch(name).limit(100);
    return res.sort((a, b) => a._doc.confidenceScore > b._doc.confidenceScore);
  }
  async searchCompany(name) {
    let res = await companySanction.fuzzySearch(name).limit(100);
    return res.sort((a, b) => a._doc.confidenceScore > b._doc.confidenceScore);
  }
}

module.exports = SanctionService;
