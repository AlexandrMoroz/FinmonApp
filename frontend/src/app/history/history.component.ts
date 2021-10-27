import {
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { HistoryService } from '../services/history.service';
import { SearchService } from '../services/search.service';
import * as XLSX from 'xlsx';
class CompanyService {
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
class Company {
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
            Реєстраціїний номер ${this.clientCode}<br>`;
  }
  toHTMLHeaderString() {
    return `${this.shortName}  ${this.clientCode}`;
  }
  toFileNameString() {
    return `${this.shortName}_${this.clientCode}`;
  }
}
class PersonService {
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
class Person {
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
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HistoryComponent {
  SearchText: string;
  selectedService: any = null;
  dataServices: Array<any>;
  isLoading: boolean = false;
  list: Array<any> = [];
  history: Array<any>;
  selectedItem: any = null;
  timelineReverceFlag: boolean = false;
  @ViewChild('historyContainer', { static: false })
  historyContainer: ElementRef;
  constructor(
    private historyService: HistoryService,
    private searchService: SearchService,
    private flashMessagesService: FlashMessagesService
  ) {
    this.dataServices = [new CompanyService(), new PersonService()];
  }
  DataServiceItemOnClick(selectedServiceItem) {
    this.dataServices.forEach((item) => (item.active = false));
    selectedServiceItem.active = !selectedServiceItem.active;
    this.selectedService = selectedServiceItem;
    this.list = null;
    this.SearchText = null;
  }
  ItemOnClick(event, selectedItem) {
    this.isLoading = true;
    this.historyService
      .getHistory(this.selectedService, selectedItem.formDataResultId)
      .subscribe(
        (data: any) => {
          this.historyContainer.nativeElement.innerHTML = data;
          this.selectedItem = selectedItem;

          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }
  downloadHistory(event, selectedItem) {
    this.historyService
      .getXLSXFile(this.selectedService, selectedItem.formDataResultId)
      .subscribe(
        (data: any) => {
          const wb = XLSX.read(data.result, { type: 'base64' });
          XLSX.writeFile(wb, `${selectedItem.toFileNameString()}_history.xlsx`);
          this.selectedItem = selectedItem;
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }
  onKey(event: any) {
    // without type info
    if (event.target.value.toString().length > 4) {
      this.isLoading = true;
      this.searchService
        .search(this.selectedService.search, event.target.value.toString())
        .subscribe((data: any) => {
          this.list = this.selectedService.createTypeArray(data.result);
          this.isLoading = false;
        });
    }
  }
}
