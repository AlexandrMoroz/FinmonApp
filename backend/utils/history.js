let { OPERATIONS, Formater } = require("./formater.js");
let Cellwalker = require("./cellwalker.js");
let XLSX = require("xlsx");

class XLSXHistory {
  constructor(translate_arr) {
    this.translate_arr = translate_arr;
    this.wb = XLSX.utils.book_new();
    this.ws = XLSX.utils.aoa_to_sheet([]);
    XLSX.utils.book_append_sheet(this.wb, this.ws, "Історія");
  }
  Add(arr, cell, goDown = true) {
    XLSX.utils.sheet_add_aoa(this.ws, [arr], {
      origin: cell.getCurrentCell(),
    });
    goDown ? cell.goDown() : "";
  }
  recurceAdd(value, cell) {
    if (typeof value === "object" && !Array.isArray(value)) {
      cell.goRight();
      cell.goRight();
      Object.entries(value).forEach(([key, val]) => {
        if (typeof val === "object" && !Array.isArray(val)) {
          this.Add([key], cell);
          let newCell = cell.copy();
          this.recurceAdd(val, newCell);
          cell.setCurrentRow(newCell.getCurrentRow());
        } else {
          this.Add([key, val], cell);
        }
      });
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        let newCell = cell.copy();
        this.recurceAdd(item, newCell);
        cell.setCurrentRow(newCell.getCurrentRow());
      });
    } else {
      cell.goRight();
      cell.goRight();
      this.Add([value], cell);
    }
  }

  createHistoryBuf(json) {
    let cellwalker = new Cellwalker();
    let formater = new Formater(this.translate_arr);

    json.forEach((i) => {
      let formatedJSON = formater.format(i.diff);
      this.Add(
        [
          "Користувач: ",
          i.user,
          "Дата створенно",
          new Date(i.createdAt).toLocaleString(),
        ],
        cellwalker
      );
      formatedJSON.forEach((item) => {
        this.Add([item.op, item.path], cellwalker, false);
        if (item.op === OPERATIONS.replace) {
          this.recurceAdd({ was: item.was, became: item.became }, cellwalker);
        } else {
          this.recurceAdd(item.value, cellwalker);
        }
        cellwalker.setCurrentColToFirst();
      });
    });

    return XLSX.write(this.wb, { type: "base64", bookType: "xlsx" });
  }
}
const recursFormResult = (res, order, arr) => {
  if (typeof res === "object" && !Array.isArray(res)) {
    Object.entries(res).forEach(([key, value]) => {
      if (order[key] !== undefined && order[key].c) {
        arr[order[key].p] = {
          [key]: recursFormResult(value, order[key].c, []),
        };
      } else if (order[key] && !order[key].d) {
        arr[order[key].p] = { [key]: value };
      }
    });
  } else if (Array.isArray(res)) {
    return res.map((item) => recursFormResult(item, order, []));
  }
  return arr.filter((item) => item != null);
};
module.exports = XLSXHistory;
module.exports.recursFormResult = recursFormResult;
