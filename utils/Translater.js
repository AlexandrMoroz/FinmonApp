const Translate = (arr) => {
  const translateArr = arr;

  const translate = (word) => {
    return translateArr[word] === undefined ? word : translateArr[word];
  }
  const recurce = (value) => {
    
    if (typeof value === "object" && !Array.isArray(value)) {
      let temp = {};
      Object.entries(value).forEach(([key, val]) => {
        if (typeof val === "object" && !Array.isArray(val)) {
          temp[translate(key)] = recurce(val);
        } else {
          temp[translate(key)] = translate(val);
        }
      });
      return temp;
    } else if (Array.isArray(value)) {
      return value.map((item) => {
        return recurce(item);
      });
    } else {
      return translate(value);
    }
  }
  return (value) => recurce(value);
}

module.exports = Translate;
