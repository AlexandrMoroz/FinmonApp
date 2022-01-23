const Helper = require("../models/helper");

const HelperValidation = {
  getCreateValidation: () => {
    return {
      name: {
        in: ["body"],
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле Name пустое",
          bail: true,
        },
        isString: {
          errorMessage: "Поле Name должнол быть строкой",
          bail: true,
        },
        isLength: {
          errorMessage: "Поле name должно содержать больше 1 символа",
          options: { min: 1 },
          bail: true,
        },
        custom: {
          options: async (value) => {
            let helpers = await Helper.find({ name: value });
            if (helpers.length != 0)
              throw new Error("Поле Name должнол быть уникальным");
          },
        },
      },
      result: {
        in: ["body"],
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле result пустое",
          bail: true,
        },
      },
    };
  },
  getByNameValidation: () => {
    return {
      name: {
        in: ["query"],
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле name пустое",
        },
        isString: {
          errorMessage: "Поле name должнол быть строкой",
          bail: true,
        },
        isLength: {
          errorMessage: "Поле name должно содержать больше 1 символа",
          options: { min: 1 },
          bail: true,
        },
        custom: {
          options: async (value) => {
            let helper = await Helper.exists({ name: value });
            if (!helper) throw new Error("Helper не найден");
            return true;
          },
        },
      },
    };
  },
};

module.exports = HelperValidation;
