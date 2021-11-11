const BaseForm = require("./BaseForm");

module.exports = class IdentificationData extends BaseForm {
  constructor(type) {
    this.personData = [
      {
        className: "col-4",
        key: "Family",
        type: "input",
        templateOptions: {
          label: "Прізвище",
          placeholder: "Прізвище",
          required: true,
        },
      },
      {
        className: "col-4",
        key: "Name",
        type: "input",
        templateOptions: {
          label: "Ім'я",
          placeholder: "Ім'я",
          required: true,
        },
      },
      {
        className: "col-4",
        key: "Surname",
        type: "input",
        templateOptions: {
          label: "По батькові",
          placeholder: "По батькові",
        },
      },
      {
        className: "col-4",
        key: "INN",
        type: "input",
        templateOptions: {
          label: "ІНПП",
          placeholder: "ІНПП",
        },
      },
      {
        className: "col-4",
        key: "Birthday",
        type: "input",
        templateOptions: {
          type: "date",
          label: "Дата нарождения",
          placeholder: "Дата нарождения",
          required: true,
        },
      },
      {
        className: "col-4",
        key: "PlaceOfBirth",
        type: "input",
        templateOptions: {
          label: "Місце нарождення",
          placeholder: "Місце нарождення",
        },
      },
      {
        className: "col-6",
        key: "IDDocument",
        type: "select",
        templateOptions: {
          required: true,
          label: "Документ що посвідчує особу",
          options: [
            { label: "свідоцтво про народження (України)", value: 1 },
            { label: "паспорт громадянина України", value: 2 },
            {
              label: "паспорт громадянина України для виїзду за кордон",
              value: 3,
            },
            { label: "дипломатичний паспорт України", value: 4 },
            { label: "службовий паспорт України", value: 5 },
            { label: "посвідчення особи моряка (України)", value: 6 },
            {
              label: "посвідчення члена екіпажу (України)",
              value: 7,
            },
            {
              label: "посвідчення особи на повернення в Україну (України)",
              value: 8,
            },
            {
              label: "тимчасове посвідчення громадянина України",
              value: 9,
            },
            { label: "посвідчення водія (України)", value: 10 },
            {
              label:
                "посвідчення особи без громадянства для виїзду за кордон (України)",
              value: 11,
            },
            {
              label: "посвідка на постійне проживання (України)",
              value: 12,
            },
            {
              label: "посвідка на тимчасове проживання (України)",
              value: 13,
            },
            { label: "картка мігранта (України)", value: 14 },
            { label: "посвідчення біженця (України)", value: 15 },
            {
              label: "проїзний документ біженця (України)",
              value: 16,
            },
            {
              label:
                "посвідчення особи яка потребує додаткового захисту (України)",
              value: 17,
            },
            {
              label:
                "посвідчення особи якій надано тимчасовий захист (України)",
              value: 18,
            },
            {
              label: "паспортний документ іноземця (іноземна держава)",
              value: 19,
            },
          ],
        },
      },
      {
        className: "col-3",
        key: "IDSeries",
        type: "input",
        templateOptions: { label: "Серія", placeholder: "Серія" },
      },
      {
        className: "col-3",
        key: "IDNumber",
        type: "input",
        templateOptions: {
          label: "Номер",
          placeholder: "Номер",
          required: true,
        },
      },
      {
        className: "col-6",
        key: "IDGovAgency",
        type: "input",
        templateOptions: {
          label: "Орган що видав документ",
          placeholder: "Орган що видав документ",
          required: true,
        },
      },
      {
        className: "col-6",
        key: "IDDateRelise",
        type: "input",
        templateOptions: {
          type: "date",
          label: "Дата видачі документу",
          placeholder: "Дата видачі документу",
          required: true,
        },
      },
      {
        key: "UNIR",
        type: "input",
        className: "col-6",
        templateOptions: {
          label: "Унікальний номер запису в демографичному реєстрі реєстрі",
          placeholder:
            "Унікальний номер запису в демографичному реєстрі реєстрі",
        },
      },
      {
        key: "Citizen",
        type: "select",
        className: "col-6",
        templateOptions: {
          label: "Громадянство",
          placeholder: "Громадянство",
        },
      },
      {
        className: "col-6",
        key: "Telephone",
        type: "input",
        templateOptions: { type: "tel", label: "Телефон" },
      },
      {
        className: "col-6",
        key: "Email",
        type: "input",
        templateOptions: { type: "email", label: "Email" },
      },
      {
        key: "IsResident",
        type: "checkbox",
        className: "col-6",
        templateOptions: { label: "Резидент ?" },
        defaultValue: true,
      },
    ];
    this.companyData = [
      {
        className: "col-4",
        key: "ShortName",
        type: "input",
        templateOptions: {
          label: "Скорочене найменування (за наявності)",
          placeholder: "Скорочене найменування (за наявності)",
        },
      },
      {
        className: "col-4",
        key: "FullName",
        type: "input",
        templateOptions: {
          label: "Повне найменування",
          placeholder: "Повне найменування",
          required: true,
        },
      },
      {
        className: "col-4",
        key: "LegalForm",
        type: "input",
        templateOptions: {
          label: "Організаційно-правова форма",
          placeholder: "Організаційно-правова форма",
        },
      },
      {
        className: "col-4",
        key: "OwnershipForm",
        type: "input",
        templateOptions: {
          label: "Форма власності",
          placeholder: "Форма власності",
        },
      },
      {
        className: "col-4",
        key: "ClientCode",
        type: "input",
        modelOptions: { updateOn: "blur" },
        templateOptions: {
          type: "number",
          label: "Код (за наявності) клієнта",
          placeholder: "Код (за наявності) клієнта",
          required: true,
        },
      },
      {
        className: "col-4",
        key: "RegistNumber",
        type: "input",
        modelOptions: { updateOn: "blur" },
        templateOptions: {
          label: "Реєстраційний (обліковий) номер",
          placeholder: "Реєстраційний (обліковий) номер",
        },
      },
      {
        className: "col-4",
        key: "DateOfRegistration",
        type: "input",
        templateOptions: {
          type: "date",
          label: "Дата реєстрації",
          placeholder: "Дата реєстрації",
          required: true,
        },
      },
      {
        className: "col-4",
        key: "Registrat",
        type: "input",
        templateOptions: {
          label: "Орган реєстрації (за наявності)",
          placeholder: "Орган реєстрації (за наявності)",
        },
      },
      {
        className: "col-4",
        key: "IsResident",
        type: "checkbox",
        defaultValue: false,
        templateOptions: {
          label: "Резидент",
          placeholder: "Резидент",
        },
      },
      {
        className: "col-12",
        key: "CertificateDetails",
        type: "input",
        templateOptions: {
          label:
            "Реквізити свідоцтва про реєстрацію або витяг з банківського, торгового чи судового реєстру",
          placeholder:
            "Реквізити свідоцтва про реєстрацію або витяг з банківського, торгового чи судового реєстру",
        },
      },
    ];
    this.template = {
      templateOptions: { label: "Паспортні дані" },
      fieldGroupClassName: "d-flex flex-wrap align-items-end",
      fieldGroup: "a",
    };
  }
};
