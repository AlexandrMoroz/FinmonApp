const Person = require("../models/person");
const PersonFormData = require("../models/personFormData");
const mongoose = require("mongoose");
const PersonValidator = {
  getCreateValidation: () => {
    return {
      result: {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле result порожне",
        },
      },
      "result.IsResident": {
        exists: {
          checkNull: true,
          errorMessage: "Поле Резидент порожне",
          bail: true,
        },
      },
      "result.Name": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле Имя порожне",
          bail: true,
        },
        isString: {
          errorMessage: "Поле Имя повинно бути строкою",
          bail: true,
        },
        isLength: {
          errorMessage: "Поле Имя повинно містити больше 1 символа",
          options: { min: 1 },
          bail: true,
        },
      },
      "result.Family": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле Фамилия порожне",
          bail: true,
        },
        isString: {
          errorMessage: "Поле Фамилия повинно бути строкою",
          bail: true,
        },
        isLength: {
          errorMessage: "Поле Фамилия повинно містити больше 1 символа",
          options: { min: 1 },
          bail: true,
        },
      },
      "result.INN": {
        custom: {
          options: async (value, { req }) => {
            if (req.body.result["IsResident"]) {
              if (!value || value.length == 0)
                throw new Error("Поле ИНН порожне");
              if (value.toString().length != 10)
                throw new Error("Поле ИНН повинно містити 10 символів");
              let person = await Person.find({ INN: value });
              if (person.length > 1)
                throw new Error("ИНН вже використовується");
            }
            return true;
          },
          bail: true,
        },
        customSanitizer: {
          options: async (value) => {
            if (value == undefined) {
              return;
            }
            return new String(value);
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
          errorMessage: "Поле result порожне",
        },
      },
      formDataResultId: {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле formDataResultId порожне",
          bail: true,
        },
        isString: {
          errorMessage: "Поле formDataResultId повинно бути строкою",
          bail: true,
        },
        custom: {
          options: async (value) => {
            if (!mongoose.Types.ObjectId.isValid(value))
              throw new Error("Помилковый тип formDataResultId");
            let flag = await PersonFormData.exists({ _id: value });
            if (!flag)
              throw new Error(
                "Дані про особу за formDataResultId не знайденно"
              );
            return true;
          },
        },
      },
      _id: {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле _id порожне",
          bail: true,
        },
        isString: {
          errorMessage: "Поле _id повинно бути строкою",
          bail: true,
        },
        custom: {
          options: async (value) => {
            if (!mongoose.Types.ObjectId.isValid(value))
              throw new Error("Помилковый тип _id");
            let flag = await Person.exists({ _id: value });
            if (!flag) throw new Error("Особу за _id не знайденно");
            return true;
          },
        },
      },
      "result.Name": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле Имя порожне",
          bail: true,
        },
        isString: {
          errorMessage: "Поле Имя повинно бути строкою",
          bail: true,
        },
        isLength: {
          errorMessage: "Поле Имя повинно містити больше 1 символа",
          options: { min: 1 },
          bail: true,
        },
      },
      "result.Family": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле Фамилия порожне",
          bail: true,
        },
        isString: {
          errorMessage: "Поле Фамилия повинно бути строкою",
          bail: true,
        },
        isLength: {
          errorMessage: "Поле Фамилия повинно містити больше 1 символа",
          options: { min: 1 },
          bail: true,
        },
      },
      "result.INN": {
        custom: {
          options: async (value, { req }) => {
            if (req.body.result["IsResident"]) {
              if (!value) throw new Error("Поле ИНН порожне");
              if (value.toString().length != 10)
                throw new Error("Поле ИНН повинно містити 10 символів");
              let personById = await Person.findOne({
                _id: req.body.result["_id"],
              });
              let personByCode = await Person.find({ clientCode: value });
              if (
                !personByCode &&
                personByCode.filter((e) => e._id != personById._id) != 0
              )
                throw new Error("Поле ИНН повинно бути унікальним");
            }
          },
          bail: true,
        },
        customSanitizer: {
          options: async (value) => {
            if (value == undefined) {
              return;
            }
            return new String(value);
          },
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
          errorMessage: "Поле id порожне",
          bail: true,
        },
        isString: {
          errorMessage: "Поле id повинно бути строкою",
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
              throw new Error("Невірний тип id");
            let flag = await PersonFormData.exists({ _id: value });
            if (!flag) throw new Error("Невірний id");
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
          errorMessage: "Поле Поиска порожне",
          bail: true,
        },
        isString: {
          errorMessage: "Поле Поиска повинно бути строкою",
          bail: true,
        },
        isLength: {
          errorMessage: "Поле Поиска повинно містити більше 2 символів",
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
          errorMessage: "Поле id порожне",
          bail: true,
        },
        isString: {
          errorMessage: "Поле id повинно бути строкою",
          bail: true,
        },
        custom: {
          options: async (value) => {
            if (!mongoose.Types.ObjectId.isValid(value))
              throw new Error("Невірний тип id");
            let flag = await Person.exists({ _id: value });
            if (!flag) throw new Error("Невірний id");
            return true;
          },
        },
      },
    };
  },
  getFinRateValidation: () => {
    return {
      id: {
        in: ["query"],
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле id порожне",
          bail: true,
        },
        isString: {
          errorMessage: "Поле id повинно бути строкою",
          bail: true,
        },
        custom: {
          options: async (value) => {
            if (!mongoose.Types.ObjectId.isValid(value))
              throw new Error("Невірний тип id");
            let flag = await PersonFormData.exists({ _id: value });
            if (!flag) throw new Error("Невірний id");
            return true;
          },
        },
        customSanitizer: {
          options: (value) => {
            return value.toString();
          },
        },
      },
    };
  },
};

module.exports = PersonValidator;
