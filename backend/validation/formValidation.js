const Form = require("../models/form");
const mongoose = require("mongoose");
const FormValidation = {
  getCreateValidation: () => {
    return {
      name: {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле Name не найденно",
          bail: true,
        },
        isString: {
          errorMessage: "Поле Name должнол быть строкой",
          bail: true,
        },
        isLength: {
          errorMessage: "Поле Name должно содержать больше 1 символа",
          options: { min: 1 },
          bail: true,
        },
      },
      content: {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле content пустое",
          bail: true,
        },
        isArray: {
          errorMessage:
            "Поле content должнол быть массивом и содержать хотябы один елемент",
          bail: true,
          options: { min: 1 },
        },
      },
    };
  },
  getEditValidation: () => {
    return {
      id: {
        custom: {
          options: async (value) => {
            let form = await Form.exists({ _id: value });
            if (form.length == 0) throw new Error("Форма не найденна");
          },
        },
      },
      name: {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле Name не найденно",
          bail: true,
        },
        isString: {
          errorMessage: "Поле Name должнол быть строкой",
          bail: true,
        },
        isLength: {
          errorMessage: "Поле Name должно содержать больше 1 символа",
          options: { min: 1 },
          bail: true,
        },
      },
      content: {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле content пустое",
          bail: true,
        },
        isArray: {
          errorMessage: "Поле content должнол быть массивом",
          bail: true,
        },
      },
    };
  },
  getFormByIdValidation: () => {
    return {
      name: {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле name пустое",
          bail: true,
        },
        isString: {
          errorMessage: "Поле name должнол быть строкой",
          bail: true,
        },
        isLength: {
          errorMessage: "Поле Name должно содержать больше 1 символа",
          options: { min: 1 },
          bail: true,
        },
        customSanitizer: {
          options: (value) => {
            return value.toString();
          },
        },
        custom: {
          options: async (value) => {
            let flag = await Form.exists({ name: value });
            if (!flag) throw new Error("Форма не найденна");
            return true;
          },
        },
      },
    };
  },
};

module.exports = FormValidation;
