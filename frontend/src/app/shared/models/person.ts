export class PersonFormater {
  name: string = 'Фізичні особи';
  service: string = 'person-history';
  file_service: string = 'person-history-file';
  search: string = 'person';
  createTypeArray(arr: Array<any>) {
    return arr.map((item) => {
      return new Person(item);
    });
  }
}
export class Person {
  name: string;
  surname: string;
  family: string;
  createdAt: string;
  user: string;
  formDataResultId: string;
  inn: string;
  constructor(arg) {
    this.createdAt = new Date(arg.createdAt).toLocaleString();
    this.user = arg.username;
    this.name = arg.name;
    this.family = arg.family;
    this.surname = arg.surname;
    this.inn = arg.INN;
    this.formDataResultId = arg.formDataResultId;
  }
  toHTMLSerchString() {
    return `Ім'я: ${this.name} <br>
              Призвище: ${this.family}<br>
              По батьковій: ${this.surname}<br>
              ІПН: ${this.inn == undefined ? '' : this.inn}<br>`;
  }
  toHTMLHeaderString() {
    return `${this.name} 
              ${this.family}
              ${this.surname == undefined ? '' : this.surname}
              ${this.inn == undefined ? '' : this.inn}`;
  }
  toFileNameString() {
    return `${this.name}_${this.family}_${
      this.surname == undefined ? '' : this.surname
    }`;
  }
}
