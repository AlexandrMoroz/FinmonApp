export class CompanyFormater {
  name: string = 'Юридичні особи';
  service: string = 'company-history';
  file_service: string = 'company-history-file';
  search: string = 'company';
  createTypeArray(arr: Array<any>) {
    return arr.map((item) => {
      return new Company(item);
    });
  }
}
export class Company {
  shortName: string;
  clientCode: string;
  createdAt: string;
  user: string;
  formDataResultId: string;
  constructor(arg) {
    this.createdAt = new Date(arg.createdAt).toLocaleString();
    this.user = arg.username;
    this.shortName = arg.shortName;
    this.clientCode = arg.clientCode;
    this.formDataResultId = arg.formDataResultId;
  }
  toHTMLSerchString() {
    return `Назва: ${this.shortName} <br>
              Реєстраціїний номер: ${this.clientCode}<br>`;
  }
  toHTMLHeaderString() {
    return `${this.shortName}  ${this.clientCode}`;
  }
  toFileNameString() {
    return `${this.shortName}_${this.clientCode}`;
  }
}
