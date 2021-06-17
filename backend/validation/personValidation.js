const Person = require("../models/person");
const personFormData = require("../models/personFormData");
const mongoose = require("mongoose");
const PersonValidator = {
  getCreateValidation: () => {
    return {
      result: {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле result пустое",
        },
        custom: {
          options: (value) => {
            if (!value) throw new Error("Поле result пустое");
            return true;
          },
        },
      },
      "result.Name": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле Имя не найденно",
          bail: true,
        },
        isString: {
          errorMessage: "Поле Имя должнол быть строкой",
          bail: true,
        },
        isLength: {
          errorMessage: "Поле Имя должно содержать больше 1 символа",
          options: { min: 1 },
          bail: true,
        },
      },
      "result.Family": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле Фамилия пустое",
          bail: true,
        },
        isString: {
          errorMessage: "Поле Фамилия должнол быть строкой",
          bail: true,
        },
        isLength: {
          errorMessage: "Поле Фамилия должно содержать больше 1 символа",
          options: { min: 1 },
          bail: true,
        },
      },
      "result.INN": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле ИНН пустое",
          bail: true,
        },
        customSanitizer: { options: async (value) => new String(value) },
        isLength: {
          errorMessage: "Поле ИНН должно содержать больше 1 символа",
          options: { min: 10, max: 10 },
          bail: true,
        },

        custom: {
          options: async (value) => {
            let person = await Person.find({ INN: value });
            if (person.length != 0) throw new Error("ИНН уже используется");
          },
        },
      },
    };
  },
  getEditValidation: () => {
    return {
      result: {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле result пустое",
        },
      },
      "result.Name": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле Имя не найденно",
          bail: true,
        },
        isString: {
          errorMessage: "Поле Имя должнол быть строкой",
          bail: true,
        },
        isLength: {
          errorMessage: "Поле Имя должно содержать больше 1 символа",
          options: { min: 1 },
          bail: true,
        },
      },
      "result.Family": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле Фамилия пустое",
          bail: true,
        },
        isString: {
          errorMessage: "Поле Фамилия должнол быть строкой",
          bail: true,
        },
        isLength: {
          errorMessage: "Поле Фамилия должно содержать больше 1 символа",
          options: { min: 1 },
          bail: true,
        },
      },
      "result.INN": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле ИНН пустое",
          bail: true,
        },
        customSanitizer: { options: async (value) => new String(value) },
        isLength: {
          errorMessage: "Поле ИНН должно содержать больше 1 символа",
          options: { min: 10, max: 10 },
          bail: true,
        },
        custom: {
          options: async (value) => {
            let person = await Person.find({ INN: value });
            if (person.length > 1) throw new Error("ИНН уже используется");
            if ((person.length = 0)) throw new Error("ИНН не найден");
          },
        },
      },
      formDataResultId: {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле formDataResultId пустое",
          bail: true,
        },
        isString: {
          errorMessage: "Поле formDataResultId должнол быть строкой",
          bail: true,
        },
      },
      _id: {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле _id пустое",
          bail: true,
        },
        isString: {
          errorMessage: "Поле _id должнол быть строкой",
          bail: true,
        },
      },
    };
  },
  getFormDataValidation: () => {
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
        customSanitizer: {
          options: (value) => {
            return value.toString();
          },
        },
        custom: {
          options: async (value) => {
            if (!mongoose.Types.ObjectId.isValid(value))
              throw new Error("Неверный тип id");
            let flag = await personFormData.exists({ _id: value });
            if (!flag) throw new Error("Неверный id");
            return true;
          },
        },
      },
    };
  },
  getSearchValidation: () => {
    return {
      searchText: {
        in: ["query"],
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле Поиска пустое",
          bail: true,
        },
        isString: {
          errorMessage: "Поле Поиска должнол быть строкой",
          bail: true,
        },
        isLength: {
          errorMessage: "Поле Поиска должно содержать более 2 символов",
          options: { min: 2, max: 100 },
          bail: true,
        },
        customSanitizer: { options: (value, { req }) => new String(value) },
      },
    };
  },
  getFileValidation: () => {
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
            let flag = await Person.exists({ _id: value });
            if (!flag) throw new Error("Неверный id");
            return true;
          },
        },
      },
    };
  },
};

module.exports = PersonValidator;
