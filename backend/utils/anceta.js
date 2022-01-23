const Translate = require("./translate");
const Cellwalker = require("./cellwalker");
let XLSX = require("xlsx");

class XLSXAnceta {
  constructor(translateArr) {
    this.translate = Translate(translateArr);
    this.cellwalker = new Cellwalker();
    this.wb = XLSX.utils.book_new();
    this.ws = XLSX.utils.aoa_to_sheet([]);
    XLSX.utils.book_append_sheet(this.wb, this.ws, "Анкета");
  }

  Add(arr, cell, goDown = true, doTranslate = true) {
    let temp = doTranslate ? this.translate(arr) : arr;
    XLSX.utils.sheet_add_aoa(this.ws, [temp], {
      origin: cell.getCurrentCell(),
    });
    goDown ? cell.goDown() : "";
  }
  recurceAdd(value, cell) {
    if (typeof value === "object" && !Array.isArray(value)) {
      cell.goRight();
      Object.entries(value).forEach(([key, val]) => {
        if (typeof val === "object" && !Array.isArray(val)) {
          this.Add([key], cell);
          let newCell = cell.copy();
          this.recurceAdd(val, newCell);
          cell.setCurrentRow(newCell.getCurrentRow());
        } else if (Array.isArray(val)) {
          this.Add([key], cell, false);
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
      this.Add([value], cell);
    }
  }

  createFormBuf(json) {
    this.Add([json.title], this.cellwalker, true, false);
    this.Add(
      ["Створенно користувачем", json.user, "Дата створення:", json.createdAt],
      this.cellwalker,
      true,
      false
    );

    Object.entries(json.result).forEach(([key, val]) => {
      this.Add([key], this.cellwalker, false);
      this.recurceAdd(val, this.cellwalker);
      this.cellwalker.setCurrentColToFirst();
    });

    return XLSX.write(this.wb, { type: "base64", bookType: "xlsx" });
  }
}
module.exports = XLSXAnceta;
