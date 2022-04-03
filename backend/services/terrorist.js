const axios = require("axios");
const convert = require("xml-js");
const PersonTerrorist = require("../models/personTerrorist");
const CompanyTerrorist = require("../models/companyTerrorist");

class TerroristService {
  constructor() {}

  async updateFromSite() {
    try {
      let res = await axios.get(
        "https://fiu.gov.ua/assets/userfiles/Terror/zBlackListFull.xml"
      );
      if (res.status == 200) {
        console.log("Terror update start");
        let options = {
          compact: true,
          trim: true,
          ignoreDeclaration: true,
          ignoreInstruction: true,
          ignoreAttributes: true,
          ignoreComment: true,
          ignoreCdata: true,
          ignoreDoctype: true,
          textFn: this.removeJsonTextAttribute,
        };

        let result = JSON.parse(convert.xml2json(res.data, options));
        let persons = [];
        let companeis = [];

        result?.list-terror?.acount-list.forEach((el) => {
          if (el["type-entry"] == 2) {
            persons.push(this.mapAkaList(el["aka-list"]));
          } else if (el["type-entry"] == 1) {
            companeis.push(this.mapAkaList(el["aka-list"]));
          }
        });
        await PersonTerrorist.deleteMany();
        await CompanyTerrorist.deleteMany();
        await PersonTerrorist.insertMany(
          persons.flat(Infinity).map((item) => {
            return { name: item.trim() };
          })
        );
        await CompanyTerrorist.insertMany(
          companeis.flat(Infinity).map((item) => {
            return { name: item.trim() };
          })
        );
        console.log("Terror update over");
        return true;
     
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  mapAkaList(akalist) {
    if (Array.isArray(akalist))
      return akalist.map((item) => {
        return Object.entries(item)
          .map(([key, val]) => {
            if (key.includes("aka-name")) return val;
          })
          .join(" ");
      });
    else {
      return Object.entries(akalist)
        .map(([key, val]) => {
          if (key.includes("aka-name")) return val;
        })
        .join(" ");
    }
  }
  removeJsonTextAttribute(value, parentElement) {
    try {
      const parentOfParent = parentElement._parent;
      const pOpKeys = Object.keys(parentElement._parent);
      const keyNo = pOpKeys.length;
      const keyName = pOpKeys[keyNo - 1];
      const arrOfKey = parentElement._parent[keyName];
      const arrOfKeyLen = arrOfKey.length;
      if (arrOfKeyLen > 0) {
        const arr = arrOfKey;
        const arrIndex = arrOfKey.length - 1;
        arr[arrIndex] = value;
      } else {
        parentElement._parent[keyName] = value;
      }
    } catch (e) {}
  }

  async searchPerson(name) {
    let res = await PersonTerrorist.fuzzySearch(name).limit(100);
    return res.sort((a, b) => a._doc.confidenceScore > b._doc.confidenceScore);
  }
  async searchCompany(name) {
    let res = await CompanyTerrorist.fuzzySearch(name).limit(100);
    return res.sort((a, b) => a._doc.confidenceScore > b._doc.confidenceScore);
  }
}

module.exports = TerroristService;
