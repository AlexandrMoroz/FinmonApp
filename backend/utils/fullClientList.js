// const Translate = require("./translate");
const Cellwalker = require("./cellwalker");
let XLSX = require("xlsx");

class XLSXClientFullList {
  constructor(translateArr) {
    // this.translate = Translate(translateArr);
    this.cellwalker = new Cellwalker("B", "2");
    this.wb = XLSX.utils.book_new();
    this.ws = XLSX.utils.aoa_to_sheet([]);
    XLSX.utils.book_append_sheet(this.wb, this.ws, "Список клієнтів");
  }

  Add(arr, cell, goDown = true, doTranslate = true) {
    // let temp = doTranslate ? this.translate(arr) : arr;
    XLSX.utils.sheet_add_aoa(this.ws, [arr], {
      origin: cell.getCurrentCell(),
    });
    goDown ? cell.goDown() : "";
  }
  listAdd(value, cell) {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        this.Add(item, cell, true, false);
      });
    } else {
      this.Add([value], cell, false, false);
      cell.goRight();
    }
  }

  createBuf(json) {
    this.Add(
      [
        "Клієнт",
        "Код РНОКПП / ЄДРПОУ",
        "ОПФ",
        "Резидентність",
        "Проживання/Реєстарция",
        "Перебування/Фактичне місцезнаходження",
        "дата договору/операції",
        "РЕР",
        "Дата виявлення РЕР",
        "рівень ризику",
        "дата оцінки",
      ],
      this.cellwalker,
      true,
      false
    );
    json.forEach((item) => {
      Object.entries(item).map(([key, value]) => {
        this.listAdd(value, this.cellwalker);
      });
      this.cellwalker.setCurrentColToFirst();
    });

    return XLSX.write(this.wb, { type: "base64", bookType: "xlsx" });
  }
}
module.exports = XLSXClientFullList;
