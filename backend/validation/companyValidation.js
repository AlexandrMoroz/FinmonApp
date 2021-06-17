const Company = require("../models/company");
const companyFormData = require("../models/companyFormData");
const mongoose = require("mongoose");
const CompanyValidator = {
  getCreateValidation: () => {
    return {
      result: {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле result пустое",
        },
      },
      "result.ShortName": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле (Скорочене наименування) пустое",
          bail: true,
        },
        isString: {
          errorMessage: "Поле (Скорочене наименування) должнол быть строкой",
          bail: true,
        },
        custom: {
          options: async (value) => {
            let company = await Company.find({ shortName: value });
            if (company.length != 0)
              throw new Error("Поле (Скорочене наименування) должнол быть уникальным");
          },
        },
      },
      "result.RegistNumber": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле RegistNumber пустое",
          bail: true,
        },
        isString: {
          errorMessage: "Поле RegistNumber должнол быть строкой",
          bail: true,
        },
        custom: {
          options: async (value) => {
            let company = await Company.find({ registNumber: value });
            if (company.length != 0)
              throw new Error("Поле RegistNumber должнол быть уникальным");
            if (value.length != 8)
              throw new Error("Поле RegistNumber должно быть из 8 цифр");
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
      "result.ShortName": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле (Скорочене наименування) пустое",
          bail: true,
        },
        isString: {
          errorMessage: "Поле (Скорочене наименування) должнол быть строкой",
          bail: true,
        },
        custom: {
          options: async (value) => {
            let company = await Company.find({ shortName: value });
            if (company.length > 1)
              throw new Error("Поле (Скорочене наименування) уже используется");
          },
        },
      },
      "result.RegistNumber": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле RegistNumber пустое",
          bail: true,
        },
        isString: {
          errorMessage: "Поле RegistNumber должнол быть строкой",
          bail: true,
        },
        custom: {
          options: async (value) => {
            let company = await Company.find({ registNumber: value });
            if (company.length == 0)
              throw new Error("Компания не найдена по полю RegistNumber ");
            if (value.length != 8)
              throw new Error("Поле RegistNumber должно быть из 8 цифр");
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
        customSanitizer: {
          options: (value) => {
            return value.toString();
          },
        },
        custom: {
          options: async (value) => {
            if (!mongoose.Types.ObjectId.isValid(value))
              throw new Error("Неверный тип id");
            let flag = await companyFormData.exists({ _id: value });
            if (!flag) throw new Error("Неверный formDataResultId");
            return true;
          },
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
      in:["query"],
      id: {
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
            let flag = await companyFormData.exists({ _id: value });
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
        in:["query"],
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
          errorMessage: "Поле Поиска должно содержать больше 2 символа",
          options: { min: 2, max: 100 },
          bail: true,
        },
        customSanitizer: { options: (value, { req }) => new String(value) },
      },
    };
  },
  getFileValidation: () => {
    return {
      in:["query"],
      id: {
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
            let flag = await Company.exists({ _id: value });
            if (!flag) throw new Error("Неверный id");
            return true;
          },
        },
      },
    };
  },
};

module.exports = CompanyValidator;
