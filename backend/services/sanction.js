const personSanction = require("../models/personSanction");
const companySanction = require("../models/companySanction");
const axios = require("axios");

class SanctionService {
  constructor() {}
  async updatePersonFromSite() {
    try {
      let res = await axios.get(
        "https://sanctions-t.rnbo.gov.ua/api/fizosoba/"
      );
      console.log(res.status);
      if (res.status == 200) {
        await personSanction.deleteMany({});
        await personSanction.insertMany(res.data);
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
      let res = await axios.get(
        "https://sanctions-t.rnbo.gov.ua/api/jurosoba/"
      );
      if (res.status == 200) {
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
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
    // const req = https.get(options, (res) => {
    //   if (res.statusCode == 200) {
    //     console.log("RNBO companes santion was updated");
    //   }

    //   let data = [];
    //   res.on("data", async (d) => {
    //     data += d;
    //   });
    //   res.on("end", () => {
    //     console.log(data);
    //     var buf = JSON.parse(Buffer.from(data).toString());
    //     console.log(buf);
    //     //console.log(data)
    //     // await companySanction.deleteMany({});
    //     // await companySanction.insertMany(d);
    //     console.log(data);
    //     done();
    //   });
    // });

    // req.on("error", (error) => {
    //   console.error(error);
    //   return false;
    // });
    // req.end();
    //return true;
  }
  async updateFromSite() {
    let arr = [
      await this.updateCompanyFromSite(),
      await this.updatePersonFromSite(),
    ];

    return !arr.includes(false);
  }
  async searchPerson(name) {
    return await personSanction.fuzzySearch(name).limit(10);
  }
  async searchCompany(name) {
    return await companySanction.fuzzySearch(name).limit(10);
  }
}

module.exports = SanctionService;
