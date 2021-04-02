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

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HistoryComponent {
  SearchText: string;
  selectedService: any;
  dataServices: Array<any>;
  isLoading: boolean = false;
  list: Array<any> = [];
  history: Array<any>;
  selectedItem: any;
  timelineReverceFlag: boolean = false;
  @ViewChild('historyContainer', { static: false })
  historyContainer: ElementRef;

  constructor(
    private historyService: HistoryService,
    private searchService: SearchService,
    private flashMessagesService: FlashMessagesService
  ) {
    this.dataServices = [
      { name: 'Физлица', service: 'person-history', file_service: 'person-history-file' , search: 'person', translate:'person'}
    ];
  }
  DataServiceItemOnClick(selectedServiceItem) {
    this.dataServices.forEach(item=> item.active=false);
    selectedServiceItem.active = !selectedServiceItem.active;
    this.selectedService = selectedServiceItem;
  }
  ItemOnClick(event, selectedItem) {
    this.isLoading = true;
    this.historyService
      .getHistory(this.selectedService, selectedItem.FormDataResultId)
      .subscribe(
        (data: any) => {
          this.historyContainer.nativeElement.innerHTML = data;
          this.selectedItem = selectedItem;
          this.isLoading = false;
        },
        (error) => {
          this.flashMessagesService.show(`Ошибка ${error.messages}`, {
            cssClass: 'alert-danger',
            timeout: 5000,
          });
          this.isLoading = false;
        }
      );
  }
  downloadHistory(event, selectedItem){
    this.historyService
      .getXLSXFile(this.selectedService, selectedItem.FormDataResultId)
      .subscribe(
        (data: any) => {
          const wb = XLSX.read(data.result, {type: 'base64'});
          XLSX.writeFile(wb, `${selectedItem.family}_${selectedItem.name}_${selectedItem.surname}_history.xlsx`);
          this.selectedItem = selectedItem;
          this.isLoading = false;
        },
        (error) => {
          this.flashMessagesService.show(`Ошибка ${error.messages??error}`, {
            cssClass: 'alert-danger',
            timeout: 5000,
          });
          this.isLoading = false;
        }
      );
  }

  toLocalDate(arg) {
    return new Date(arg).toLocaleString();
  }
  onKey(event: any) {
    // without type info
    if (event.target.value.toString().length > 4) {
      this.isLoading = true;
      this.searchService.search(this.selectedService.search, event.target.value.toString()).subscribe(
        (data: any) => {
          this.list = data.result;
          this.isLoading = false;
        },
        (error) => {
          console.log(error);
          this.flashMessagesService.show(`Ошибка ${error.messages}`, {
            cssClass: 'alert-danger',
            timeout: 5000,
          });
        }
      );
    }
  }
}
