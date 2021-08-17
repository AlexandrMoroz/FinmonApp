const Company = require("../models/company");
const CompanyFormData = require("../models/CompanyFormData");
const mongoose = require("mongoose");

const CompanyValidator = {
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
      "result.ShortName": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле (Скорочене наименування) порожне",
          bail: true,
        },
        isString: {
          errorMessage: "Поле (Скорочене наименування) повинно бути строкою",
          bail: true,
        },
        custom: {
          options: async (value) => {
            let company = await Company.find({ shortName: value });
            if (company.length != 0)
              throw new Error(
                "Поле (Скорочене наименування) повинно бути унікальним"
              );
            return true;
          },
        },
      },
      "result.RegistNumber": {
        custom: {
          options: async (value, { req }) => {
            if (req.body.result["IsResident"]) {
              if (!value || value.length == 0)
                throw new Error(
                  "Поле Поле Реєстраційний (обліковий) номер порожне"
                );
              console.log(value.length);
              if (value.length != 17)
                throw new Error(
                  "Поле Реєстраційний (обліковий) номер повинно бути з 17 цифр"
                );
            }
            return true;
          },
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
      "result.ClientCode": {
        custom: {
          options: async (value, { req }) => {
            if (req.body.result["IsResident"]) {
              if (!value || value.length == 0)
                throw new Error("Поле Код клієнта порожне");
              if (value.length != 8)
                throw new Error("Поле Код клієнта повинно бути з 8 цифр");
              let company = await Company.find({ clientCode: value });
              if (company.length != 0)
                throw new Error("Поле Код клієнта повинно бути унікальним");
            }
            return true;
          },
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
            let flag = await CompanyFormData.exists({ _id: value });
            if (!flag)
              throw new Error(
                "Дані про компанию за formDataResultId не знайденно"
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
            let flag = await Company.exists({ _id: value });
            if (!flag) throw new Error("Компанию за _id не знайденно");
            return true;
          },
        },
      },
      "result.IsResident": {
        exists: {
          checkNull: true,
          errorMessage: "Поле Резидент порожне",
          bail: true,
        },
      },
      "result.ShortName": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле (Скорочене наименування) порожне",
          bail: true,
        },
        isString: {
          errorMessage: "Поле (Скорочене наименування) повинно бути строкою",
          bail: true,
        },
        custom: {
          options: async (value) => {
            let company = await Company.find({ shortName: value });
            if (company.length > 1)
              throw new Error(
                "Поле (Скорочене наименування) вже використовується"
              );
          },
        },
      },
      "result.RegistNumber": {
        custom: {
          options: async (value, { req }) => {
            if (req.body.result["IsResident"]) {
              if (!value || value.length == 0)
                throw new Error(
                  "Поле Поле Реєстраційний (обліковий) номер порожне"
                );
              if (value.length != 17)
                throw new Error(
                  "Поле Реєстраційний (обліковий) номер повинно бути з 17 цифр"
                );
            }
            return true;
          },
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
      "result.ClientCode": {
        custom: {
          options: async (value, { req }) => {
            if (req.body.result["IsResident"]) {
              if (!value || value.length == 0)
                throw new Error("Поле Код клієнта порожне");
              if (value.toString().length != 8)
                throw new Error("Поле Код клієнта повинно бути з 8 цифр");
              let companyById = await Company.findOne({
                _id: req.body.result["_id"],
              });
              let companyByCode = await Company.find({ clientCode: value });
              if (
                !companyByCode &&
                companyByCode.filter((e) => e._id != companyById._id) != 0
              )
                throw new Error("Поле Код клієнта повинно бути унікальним");
            }
            return true;
          },
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
      in: ["query"],
      id: {
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
            let flag = await CompanyFormData.exists({ _id: value });
            if (!flag) throw new Error("Дані компанії за _id не знайденно ");
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
          errorMessage: "Поле Поиска должно содержать больше 2 символа",
          options: { min: 2, max: 30 },
          bail: true,
        },
        customSanitizer: { options: (value, { req }) => new String(value) },
      },
    };
  },
  getFileValidation: () => {
    return {
      in: ["query"],
      id: {
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
