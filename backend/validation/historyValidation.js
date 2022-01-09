const mongoose = require("mongoose");
const HistoryValidator = {
  getHistoryValidation: (Collection) => {
    return {
      id: {
        in: ["query"],
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле id пустое",
          bail: true,
        },
        isString: {
          errorMessage: "Поле id должнол быть строкой",
          bail: true,
        },
        custom: {
          options: async (value) => {
           
            if (!mongoose.Types.ObjectId.isValid(value))
              throw new Error("Неверный тип id");
            let flag = await Collection.exists({ _id: value });
            console.log(value)
            console.log(await Collection.findOne({_id:value}))
            if (!flag) throw new Error("Неверный id");
            return true;
          },
        },
      },
    };
  },

};

module.exports = HistoryValidator;
