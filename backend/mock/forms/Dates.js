let BaseForm = require("../forms/BaseForm");
module.exports = class Dates extends BaseForm {
  constructor() {
    this.template = {
      templateOptions: { label: "Дати" },
      fieldGroupClassName: "d-flex flex-wrap align-items-start",
      fieldGroup: [
        {
          className: "col-4",
          key: "DateOfFirstSigned",
          type: "input",
          templateOptions: {
            type: "date",
            label: "Дата первинного заповнення анкети",
          },
        },
        {
          className: "col-4",
          key: "DateOfFirstBissnesContact",
          type: "input",
          templateOptions: {
            type: "date",
            label:
              "Дата встановлення ділових відносин / здійснення першої разової фінансової операції на значну суму",
          },
        },
        {
          className: "col-4",
          key: "DateOffContact",
          type: "input",
          templateOptions: {
            type: "date",
            label:
              "Дата відмови від встановлення/підтримання (розірвання) ділових (договірних) відносин",
          },
        },
        {
          className: "col-6",
          key: "IdentificationDate",
          type: "input",
          templateOptions: {
            type: "date",
            label: "Дата проведення верифікації клієнта (представника клієнта)",
          },
        },
        {
          className: "col-6",
          key: "IdentificationType",
          type: "select",
          templateOptions: {
            label:
              "Спосіб проведення верифікації клієнта (представника клієнта)",
            options: [
              { label: "Особиста фізична присутність", value: 1 },
              { label: "Режим відеотрансляції", value: 2 },
            ],
          },
        },
        {
          className: "col-6",
          key: "ServiceType",
          type: "multicheckbox",
          templateOptions: {
            type: "array",
            label: "Види послуг, якими користується клієнт",
            multiple: true,
            options: [
              { label: "Фінансовий лізинг", value: 1 },
              { label: "Факторинг", value: 2 },
              { label: "Надання позик", value: 3 },
              { label: "Надання поручительств", value: 4 },
              { label: "Надання гарантій", value: 5 },
              {
                label: "Надання фінансових кредитів за рахунок власних коштів",
                value: 6,
              },
              { label: "Обмін валют", value: 7 },
            ],
          },
        },
        {
          fieldGroupClassName: "col",
          fieldGroup: [
            {
              className: "col-12",
              key: "DateOfFreeze",
              type: "repeat-one-row",
              templateOptions: {
                title: "Дата замороження активів",
                cancelButtonClass: "ml-1",
              },
              fieldArray: {
                className: "justify-content-center",
                type: "input",
                templateOptions: { type: "date", required: true },
              },
            },
            {
              className: "col-12",
              key: "DateOfUnfreeze",
              type: "repeat-one-row",
              templateOptions: {
                title: "Дата розмороження активів",
                cancelButtonClass: "ml-1",
              },
              fieldArray: {
                className: "justify-content-center",
                type: "input",
                templateOptions: { type: "date", required: true },
              },
            },
          ],
        },
      ],
    };
    super(template);
  }
};
