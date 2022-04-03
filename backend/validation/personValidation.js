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
          errorMessage: "Поле result порожнє",
        },
      },
      "result.IsResident": {
        exists: {
          checkNull: true,
          errorMessage: "Поле Резидент порожнє",
          bail: true,
        },
      },
      "result.Name": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле Имя порожнє",
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
          errorMessage: "Поле Фамилия порожнє",
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
            if (req.body.result.IsResident) {
              if (!value || value.length == 0)
                throw new Error("Поле ИНН порожнє");
              
              if (value.toString().length != 10)
                throw new Error("Поле ИНН повинно містити 10 символів");
              
              if(value!="9999999999") {
                let person = await Person.find({ INN: value });
                if (person.length != 0)
                  throw new Error("ИНН вже використовується");
              }
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
      "result.Regist": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле місце реєстрації порожнє",
          bail: true,
        },
      },
      "result.Regist.Country": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле країна порожнє",
          bail: true,
        },
      },
      "result.Regist.Adress": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле адресс порожнє",
          bail: true,
        },
      },
      "result.Live": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле місце проживання порожнє",
          bail: true,
        },
      },
      "result.Live.Country": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле країна порожнє",
          bail: true,
        },
      },
      "result.Live.Adress": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле адресс порожнє",
          bail: true,
        },
      },
      "result.Citizen": {
        custom: {
          options: async (value, { req }) => {
           if(!req.body.result.IsResident&&!value){
            throw new Error("В не резидента повинено бути громадянство")
           }
           return true;
          },
          bail: true,
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
          errorMessage: "Поле result порожнє",
        },
      },
      formDataResultId: {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле formDataResultId порожнє",
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
      id: {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле id порожнє",
          bail: true,
        },
        isString: {
          errorMessage: "Поле id повинно бути строкою",
          bail: true,
        },
        custom: {
          options: async (value) => {
            if (!mongoose.Types.ObjectId.isValid(value))
              throw new Error("Помилковый тип id");
            let flag = await Person.exists({ _id: value });
            if (!flag) throw new Error("Особу за id не знайденно");
            return true;
          },
        },
      },
      "result.Name": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле Имя порожнє",
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
          errorMessage: "Поле Фамилия порожнє",
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
            if (req.body.result.IsResident) {
              if (!value) throw new Error("Поле ИНН порожнє");
              if (value.toString().length != 10)
                throw new Error("Поле ИНН повинно містити 10 символів");
              let personById = await Person.findOne({
                _id: req.body.result.id,
              });
              let personByCode = await Person.find({ INN: value });
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
      "result.Regist": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле місце реєстрації порожнє",
          bail: true,
        },
      },
      "result.Regist.Country": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле країна порожнє",
          bail: true,
        },
      },
      "result.Regist.Adress": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле адресс порожнє",
          bail: true,
        },
      },
      "result.Live": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле місце проживання порожнє",
          bail: true,
        },
      },
      "result.Live.Country": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле країна порожнє",
          bail: true,
        },
      },
      "result.Live.Adress": {
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле адресс порожнє",
          bail: true,
        },
      },
      "result.Citizen": {
        custom: {
          options: async (value, { req }) => {
           if(!req.body.result.IsResident&&!value){
            throw new Error("В не резидента повинено бути громадянство")
           }
           return true;
          },
          bail: true,
        },
      },
      "result.FOP":{
        custom: {
          options: async (value, { req }) => {
            if(value){
              if(req.body.result.FOP?.GovRegDocDateRelise){}
              if(req.body.result.FOP?.RegistrationNumber) {}
            }
          }}
      }
    };
  },
  getFormDataValidation: () => {
    return {
      id: {
        in: ["query"],
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле id порожнє",
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
          errorMessage: "Поле Поиска порожнє",
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
          errorMessage: "Поле id порожнє",
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
  getCalculationValidation: () => {
    return {
      id: {
        in: ["query"],
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле id порожнє",
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
