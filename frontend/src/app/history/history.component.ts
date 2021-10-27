import {
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { HistoryService } from '../services/history.service';
import { SearchService } from '../services/search.service';
import { PersonFormater } from '../shared/models/person';
import { CompanyFormater } from '../shared/models/company';
import * as XLSX from 'xlsx';

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
    this.dataServices = [new CompanyFormater(), new PersonFormater()];
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
