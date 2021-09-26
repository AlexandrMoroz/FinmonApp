const User = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const UserValidation = {
  getCreateValidation: () => {
    return {
      name: {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле имя не найденно",
          bail: true,
        },
        isString: {
          errorMessage: "Поле имя должнол быть строкой",
          bail: true,
        },
        isLength: {
          errorMessage: "Поле имя должно содержать больше 1 символа",
          options: { min: 1 },
          bail: true,
        },
      },
      family: {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле фамилия не найденно",
          bail: true,
        },
        isString: {
          errorMessage: "Поле фамилия должнол быть строкой",
          bail: true,
        },
        isLength: {
          errorMessage: "Поле фамилия должно содержать больше 1 символа",
          options: { min: 1 },
          bail: true,
        },
      },
      username: {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле логин не найденно",
          bail: true,
        },
        isString: {
          errorMessage: "Поле логин должнол быть строкой",
          bail: true,
        },
        isLength: {
          errorMessage: "Поле логин должно содержать больше 1 символа",
          options: { min: 1 },
          bail: true,
        },
        custom: {
          options: async (value) => {
            let user = await User.find({ username: value });
            if (user.length != 0) {
              throw new Error("Логин уже используется");
            }
            return true;
          },
        },
      },
      password: {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле пароль пустое",
          bail: true,
        },
        isString: {
          errorMessage: "Поле пароль должнол быть строкой",
          bail: true,
        },
        isLength: {
          errorMessage: "Поле пароль должно содержать больше 5 символа",
          options: { min: 6 },
          bail: true,
        },
        customSanitizer: {
          options: async (value) => {
            return await bcrypt.hash(value, 12);
          },
        },
      },
      passwordConfirmation: {
        optional: {
          options: {
            checkFalsy: true,
            nullable: true,
          },
          errorMessage: "Поле подтверждение пароля пустое",
          bail: true,
        },
        isString: {
          errorMessage: "Поле подтверждение пароля быть строкой",
          bail: true,
        },
        custom: {
          options: async (value, { req }) => {
            if (value !== req.body.passwordConfirmation)
              throw new Error(
                "Поле подтверждение пароля не совпадает с полем пароля"
              );
            return true;
          },
        },
      },
    };
  },
  getEditValidation: () => {
    return {
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
            let flag = await User.exists({ _id: value });
            if (!flag) throw new Error("Неверный id");
            return true;
          },
        },
      },
      name: {
        optional: {
          options: {
            checkFalsy: true,
            nullable: true,
          },
          errorMessage: "Поле имя не найденно",
          bail: true,
        },
        isString: {
          errorMessage: "Поле имя должнол быть строкой",
          bail: true,
        },
        isLength: {
          errorMessage: "Поле имя должно содержать больше 1 символа",
          options: { min: 1 },
          bail: true,
        },
      },
      family: {
        optional: {
          options: {
            checkFalsy: true,
            nullable: true,
          },
          errorMessage: "Поле фамилия не найденно",
          bail: true,
        },
        isString: {
          errorMessage: "Поле фамилия должнол быть строкой",
          bail: true,
        },
        isLength: {
          errorMessage: "Поле фамилия должно содержать больше 1 символа",
          options: { min: 1 },
          bail: true,
        },
      },
      username: {
        exists: {
          options: {
            checkFalsy: true,
            nullable: true,
          },
          errorMessage: "Поле логин не найденно",
          bail: true,
        },
        isString: {
          errorMessage: "Поле логин должнол быть строкой",
          bail: true,
        },
        isLength: {
          errorMessage: "Поле логин должно содержать больше 1 символа",
          options: { min: 1 },
          bail: true,
        },
        custom: {
          options: async (value, { req }) => {

            let userById = await User.findOne({ _id: req.body.id });
            let userByUserName = await User.find({ username: value });
            if (userByUserName.length > 1)
              throw Error("Пользователей с одинаковым логином больше 1");
            if (userByUserName.length != 0) {
              let isSameUser = userById.id === userByUserName[0].id;
              if (!isSameUser) {
                throw new Error("Логин уже используется");
              }
            }
           return true;
          },
        },
      },
      password: {
        optional: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле пароль пустое",
          bail: true,
        },
        isString: {
          errorMessage: "Поле пароль должнол быть строкой",
          bail: true,
        },
        isLength: {
          errorMessage: "Поле пароль должно содержать больше 5 символа",
          options: { min: 6 },
          bail: true,
        },
        customSanitizer: {
          options: async (value) => {
            return await bcrypt.hash(value, 12);
          },
        },
      },
      passwordConfirmation: {
        optional: {
          options: {
            checkFalsy: true,
            nullable: true,
          },
          errorMessage: "Поле подтверждение пароля пустое",
          bail: true,
        },
        isString: {
          errorMessage: "Поле подтверждение пароля быть строкой",
          bail: true,
        },
        custom: {
          options: async (value, { req }) => {
            if (value !== req.body.passwordConfirmation)
              throw new Error(
                "Поле подтверждение пароля не совпадает с полем пароля"
              );
            return true;
          },
        },
      },
    };
  },
  getLoginValidation: () => {
    return {
      username: {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле логин не найденно",
          bail: true,
        },
        isString: {
          errorMessage: "Поле логин должнол быть строкой",
          bail: true,
        },
        isLength: {
          errorMessage: "Поле логин должно содержать больше 1 символа",
          options: { min: 1 },
          bail: true,
        },
        custom: {
          options: async (value, { req }) => {
            let user = await User.findOne({ username: value });
            if (!user) throw new Error("Логин или пароль не верный");
            if (user.block) throw new Error("Вы заблокированы администратором");
            return true;
          },
        },
      },
      password: {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле пароль пустое",
          bail: true,
        },
        isString: {
          errorMessage: "Поле пароль должнол быть строкой",
          bail: true,
        },
        isLength: {
          errorMessage: "Поле пароль должно содержать больше 5 символа",
          options: { min: 6 },
          bail: true,
        },
        custom: {
          options: async (value, { req }) => {
            const user = await User.findOne({ username: req.body.username });
            if (!user) throw new Error("Логин или пароль не верный");

            const isMatch = await bcrypt.compare(value, user.password);
            if (!isMatch) throw new Error("Логин или пароль не верный");
            return true;
          },
        },
      },
    };
  },
};

module.exports = UserValidation;
