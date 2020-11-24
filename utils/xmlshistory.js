var XLSX = require("xlsx");
var CellWalker = require("./cellwalker");
let TransDict = [];

let writeToSheet = (arr) => {
  let cell = cellwalker.getRigthCell();
  XLSX.utils.sheet_add_aoa(ws, arr, {
    origin: cell,
  });
  cellwalker.getDownCell();
};

let mapHistoryDiff = (histories) => {
  let cellwalker = new CellWalker();
  histories.forEach((history) => {
    cellwalker.getDownCell();
    cellwalker.getDownCell();
    XLSX.utils.sheet_add_aoa(
      ws,
      [
        [
          "Изменено пользователем: ",
          history.user,
          "Дата:",
          toLocalDate(history.createdAt),
        ],
      ],
      {
        origin: cellwalker.currentCellCode,
      }
    );
    cellwalker.getDownCell();
    cellwalker.getDownCell();
    cellwalker.getDownCell();

    for (let diffFieldName in history.diff) {
      let diffFieldValue = history.diff[diffFieldName];
      //Get only object who has _t meens it was created if key 0 or deleted if key _0
      if (diffFieldValue._t) {
        //Get only content with out _t:'a'
        let onlyContent = Object.entries(diffFieldValue).filter(
          ([key, value]) => !key.includes("_t")
        );
        XLSX.utils.sheet_add_aoa(
          ws,
          [[`Изменено в ${Translate(diffFieldName)}`]],
          {
            origin: cellwalker.currentCellCode,
          }
        );
        cellwalker.getDownCell();
        //get only deleted objects
        onlyContent.forEach(([key, value]) => {
          if (key.includes("_")) {
            //delete object is [ oldValue5, 0, 0 ] delete two 0
            let temp = value.filter((j) => j != 0);
            //cheack is first value is object or string
            if (isObject(temp[0])) {
              //split deleted object to key value
              Object.entries(temp[0]).forEach(([key, value]) => {
                writeToSheet([[" Удаленно значение", Translate(key), value]]);
              });
            } else {
              writeToSheet([["Удаленно значение", temp[0]]]);
            }
          } else if (!key.includes("_")) {
            if (Array.isArray(value)) {
              //cheack is first value is object or string
              if (isObject(value[0])) {
                //split deleted object to key value
                Object.entries(value[0]).forEach(([key, value]) => {
                  writeToSheet([
                    ["Добавленно значение", Translate(key), value],
                  ]);
                });
              } else {
                writeToSheet([["Добавленно значение", value[0]]]);
              }
            } else {
              Object.entries(value).forEach(([key, value]) => {
                //if value is an object like representetive or benefisiar. editing value of it may contains tree of objects
                if (isObject(value)) {
                  XLSX.utils.sheet_add_aoa(
                    ws,
                    [[" ", `Изменено в ${Translate(key)}`]],
                    {
                      origin: cellwalker.currentCellCode,
                    }
                  );
                  cellwalker.getDownCell();
                  // 2 if object is edited
                  Object.entries(value).forEach(([key, value]) => {
                    if (value.length == 2) {
                      writeToSheet([
                        [
                          "",
                          "Изменено значение в",
                          Translate(key),
                          " с: ",
                          value[0],
                          " на: ",
                          value[1],
                        ],
                      ]);
                    } else {
                      writeToSheet([
                        ["", "Добавленно значение в: ", Translate(key), value],
                      ]);
                    }
                  });
                } else {
                  writeToSheet([
                    [
                      "",
                      "Изменено значение в",
                      Translate(key),
                      " с: ",
                      value[0],
                      " на: ",
                      value[1],
                    ],
                  ]);
                }
              });
            }
          }
        });
      }
      //Get else objects that was edited it
      else {
        XLSX.utils.sheet_add_aoa(
          ws,
          [[`Изменено в ${Translate(diffFieldName)}`]],
          {
            origin: cellwalker.currentCellCode,
          }
        );

        //lenght = 2 if object was edited
        if (diffFieldValue.length == 2) {
          writeToSheet([
            [
              "Изменено значение с: ",
              diffFieldValue[0],
              " на: ",
              diffFieldValue[1],
            ],
          ]);
        }
        // if temp[1] and temp[2] = 0 meens object was deleted
        else if (diffFieldValue[1] == 0 && diffFieldValue[2] == 0) {
          if (Array.isArray(diffFieldValue[0])) {
            diffFieldValue[0].forEach((item, index) => {
              XLSX.utils.sheet_add_aoa(
                ws,
                [[" ", `Удален ${Translate(diffFieldName)} ${index}`]],
                {
                  origin: cellwalker.currentCellCode,
                }
              );
              cellwalker.getDownCell();
              Object.entries(item).forEach(([key, value]) => {
                if (isObject(value)) {
                  // 2 if object is edited
                  XLSX.utils.sheet_add_aoa(
                    ws,
                    [[" ", `Удаленно в ${Translate(key)}`]],
                    {
                      origin: cellwalker.currentCellCode,
                    }
                  );
                  cellwalker.getDownCell();
                  Object.entries(value).forEach(([key, value]) => {
                    writeToSheet([
                      [" ", " Удаленно в: ", Translate(key), value],
                    ]);
                  });
                } else {
                  writeToSheet([
                    ["Удаленно значение в: ", Translate(key), value],
                  ]);
                }
              });
            });
          } else {
            writeToSheet([["Удаленно значение: ", diffFieldValue[0]]]);
          }
        } //else it was added
        else {
          if (Array.isArray(diffFieldValue[0])) {
            diffFieldValue[0].forEach((item, index) => {
              Object.entries(item).forEach(([key, value]) => {
                if (isObject(value)) {
                  // 2 if object is edited
                  XLSX.utils.sheet_add_aoa(
                    ws,
                    [[" ", `Изменено в ${Translate(key)}`]],
                    {
                      origin: cellwalker.currentCellCode,
                    }
                  );
                  cellwalker.getDownCell();
                  Object.entries(value).forEach(([key, value]) => {
                    if (value.length == 2) {
                      writeToSheet([
                        [
                          " ",
                          "Изменено значение в",
                          Translate(key),
                          " с: ",
                          value[0],
                          " на: ",
                          value[1],
                        ],
                      ]);
                    } else {
                      writeToSheet([
                        [" ", "Добавленно значение в: ", Translate(key), value],
                      ]);
                    }
                  });
                } else {
                  writeToSheet([
                    ["Добавленно значение в: ", Translate(key), value],
                  ]);
                }
              });
            });
          }
        }
      }
    }
  });
};

let isObject = (obj) => {
  return obj === Object(obj) && !Array.isArray(obj);
};

let Translate = (str) => {
  return TransDict[str] ? TransDict[str] : str;
};
let toLocalDate = (arg) => {
  return new Date(arg).toLocaleString();
};

const getXmls = async (historyArr, translateDict) => {
  TransDict = translateDict;
  let wb = XLSX.utils.book_new();
  let ws = XLSX.utils.aoa_to_sheet([]);
  XLSX.utils.book_append_sheet(wb, ws, "anceta");
  mapHistoryDiff(historyArr);
  return XLSX.write(wb, { bookType: "xlsx", type: "binary" });
};

module.exports = getXmls;
