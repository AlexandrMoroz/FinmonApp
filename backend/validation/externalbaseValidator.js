const ExternalBase = {
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
      type: {
        in: ["query"],
        exists: {
          checkFalsy: true,
          checkNull: true,
          errorMessage: "Поле Тип порожне",
          bail: true,
        },
        custom: {
          options: async (value) => {
            if (value != "company" && value != "person")
              throw new Error("Невірний тип");
          },
        },
        customSanitizer: { options: (value, { req }) => new String(value) },
      },
    };
  },
};

module.exports = ExternalBase;
