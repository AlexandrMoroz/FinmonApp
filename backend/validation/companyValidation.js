const Company = require("../models/company");
const CompanyFormData = require("../models/companyFormData");
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
            if (req.body.result.IsResident) {
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
            if (req.body.result.IsResident) {
              if (!value || value.length == 0)
                throw new Error("Поле Код клієнта порожне");
              if (value.length != 8)
                throw new Error("Поле Код клієнта повинно бути з 8 цифр");
              let company = await Company.find({ clientCode: value });
              if (company.length != 0)
                throw new Error("Поле Код клієнта повинно бути унікальним");
            }
            if (value) {
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
        custom: {
          options: async (value) => {},
        },
      },
      "result.ShortName": {
        exists: {
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
            if (!value)
              throw new Error("Поле (Скорочене наименування) порожне");
            let company = await Company.find({ shortName: value });
            if (company.length > 1)
              throw new Error(
                "Поле (Скорочене наименування) повинно бути унікальним"
              );
          },
        },
      },
      "result.RegistNumber": {
        custom: {
          options: async (value, { req }) => {
            if (req.body.result.IsResident) {
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
            if (req.body.result.IsResident) {
              if (!value || value.length == 0)
                throw new Error("Поле Код клієнта порожне");
              if (value.toString().length != 8)
                throw new Error("Поле Код клієнта повинно бути з 8 цифр");
              let companyById = await Company.findOne({
                _id: req.body.result._id,
              });
            }
            if (value) {
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
      "result.RegistPlace": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле місце реєстрації прожнє",
          bail: true,
        },
      },
      "result.RegistPlace.Country": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле країна місця реєстрації порожнє",
          bail: true,
        },
      },
      "result.RegistPlace.Adress": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле адрес місця реєстрації порожнє",
          bail: true,
        },
      },
      "result.ActualLocation": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле місце фактичного місцезнаходження порожнє",
          bail: true,
        },
      },
      "result.ActualLocation.Country": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле країна фактичного місцезнаходження порожнє",
          bail: true,
        },
      },
      "result.ActualLocation.Adress": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле адрес фактичного місцезнаходження  порожнє",
          bail: true,
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
          errorMessage: "Поле Пошуку порожне",
          bail: true,
        },
        isString: {
          errorMessage: "Поле Пошуку повинно бути строкою",
          bail: true,
        },
        isLength: {
          errorMessage: "Поле Пошуку повинно містити більше 2 символів",
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
              throw new Error("Невірний тип id");
            let flag = await Company.exists({ _id: value });
            if (!flag) throw new Error("Невірний id");
            return true;
          },
        },
      },
    };
  },
  getCalculationValidation: () => {
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
            let flag = await CompanyFormData.exists({ _id: value });
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

module.exports = CompanyValidator;
