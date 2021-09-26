let helper = require("../models/helper");

let Ofshore = await helper.findOne({ name: "OfshoreCountry" });
let country = await helper.findOne({ name: "Country" });

function foo(str1, str2) {
  str1 = str1.map((currentValue, index, array) => {
    return currentValue.charCodeAt(index);
  });
  str2 = str2.map((currentValue, index, array) => {
    return currentValue.charCodeAt(index);
  });
  console.log(`${str1}:${str2}`);
}
Ofshore