import { Component, EventEmitter, Output } from '@angular/core';
import { PersonService } from '../services/person.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FormService } from '../services/form.service';
import cloneDeepWith from 'lodash.clonedeepwith';

import { AuthService } from '../services/auth.service';
import { SearchService } from '../services/search.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss'],
})
export class PersonComponent {
  SearchText: string;
  list: Array<any> = [];
  SelectedItem: any = null;
  isLoading: boolean = false;
  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[];
  formName = 'personForm';

  constructor(
    private dataService: PersonService,
    private searchService: SearchService,
    private formservice: FormService,
    private flashMessagesService: FlashMessagesService,
    private authService: AuthService
  ) {
    this.isLoading = true;
    this.formservice.getFormByName(this.formName).subscribe(
      (data: any) => {
        this.fields = this.mapfield(data);
        this.isLoading = false;
      },
      this.ShowError
    );
  }
  mapfield(fields) {
    return cloneDeepWith(fields, (item) => {
      
      if (item?.key === 'GovRegDocDateRelise') {
        item.templateOptions.change = (
          field: FormlyFieldConfig,
          event?: any
        ) => {
          const firstDate = new Date(event.target.value);
          const secondDate = new Date();
          let ClientAge = this.CalDateBetween(secondDate, firstDate);
          let FOP = this.model['FOP'];
          FOP['ClientAge'] = ClientAge;
          this.model = { ...this.model, FOP };
        };
      }
    });
  }
  private CalDateBetween(date1, date2) {
    let diff = Math.floor(date1.getTime() - date2.getTime());
    let secs = Math.floor(diff / 1000);
    let mins = Math.floor(secs / 60);
    let hours = Math.floor(mins / 60);
    let days = Math.floor(hours / 24);
    let months = Math.floor(days / 31);
    let years = Math.floor(months / 12);

    months = Math.floor(months % 12);
    days = Math.floor(days % 31);
    hours = Math.floor(hours % 24);
    mins = Math.floor(mins % 60);
    secs = Math.floor(secs % 60);
    let message = '';
    message += days + ' дней ';
    if (months > 0 || years > 0) {
      message += months + ' месяцев ';
    }
    if (years > 0) {
      message += years + ' лет ';
    }

    return message;
  }
  private cheakObjectIsEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }
  private  cheakArrayIsEmpty(obj) {
    return obj?.length == 0;
  }
  private  isObject(a) {
    return !!a && a.constructor === Object;
  }
  private  deleteAllEmptyElement(model) {
    for (const [key, value] of Object.entries(model)) {
      if (this.isObject(value)) {
        this.cheakObjectIsEmpty(value)
          ? delete model[key]
          : this.deleteAllEmptyElement(value);
      }
      if (Array.isArray(value) && !this.cheakArrayIsEmpty(value)) {
        this.deleteAllEmptyElement(value);
      } else {
        this.cheakArrayIsEmpty(value) || this.cheakObjectIsEmpty(value)
          ? delete model[key]
          : '';
      }
    }
  }
  Submit(model) {
    //if selected item true than create person
    if (!this.SelectedItem) {
      this.deleteAllEmptyElement(model);
      let tempModel = {
        result: model,
        user: this.authService.currentUserValue.username,
      };
      this.dataService.create(tempModel).subscribe(
        (data: any) => {
          this.flashMessagesService.show('Анкета успешно добавлена', {
            cssClass: 'alert-success',
            timeout: 5000,
          });
          this.list = [
            data.result,
            ...this.list.filter((item) => item._id !== data.result._id),
          ];
          this.SelectedItem = data.result;
        },(err)=>{
          this.isLoading = false;
        }
      );
    }
    //if selected item true than edit person
    else {
      this.deleteAllEmptyElement(model);
      let submitModel = {
        _id: this.SelectedItem._id,
        formDataResultId: this.SelectedItem.formDataResultId,
        user: this.authService.currentUserValue.username,
        result: model,
      };

      this.dataService.edit(submitModel).subscribe(
        (data: any) => {
          this.flashMessagesService.show('Анкета успешно обновлена', {
            cssClass: 'alert-success',
            timeout: 5000,
          });
          this.list = [
            data.result,
            ...this.list.filter((item) => item._id !== data.result._id),
          ];
          this.SelectedItem = data.result;
        }
      );
    }
  }
  NewPerson() {
    this.model = {};
    this.SelectedItem = null;
  }
  SearchItemOnClick(event, selectedItem) {
    this.isLoading = true;
    this.dataService.getFormData(selectedItem.formDataResultId).subscribe(
      (data: any) => {
        this.model = {
          ...data.result,
        };
        this.SelectedItem = selectedItem;
        this.isLoading = false;
      },
      this.ShowError
    );
  }
  onKey(event: any) {
    // without type info
    if (event.target.value.toString().length > 4) {
      this.isLoading = true;
      this.searchService
        .search('person', event.target.value.toString())
        .subscribe(
          (data: any) => {
            this.list = data.result;
            this.isLoading = false;
          },
          this.ShowError
        );
    }
  }
  Download() {
    
    this.isLoading = true;
    this.dataService.getFile(this.SelectedItem._id).subscribe(
      (data: any) => {
        const wb = XLSX.read(data.result, { type: 'base64' });
        XLSX.writeFile(
          wb,
          `${this.SelectedItem.family}_${this.SelectedItem.name}_${this.SelectedItem.surname}.xlsx`
        );
        this.isLoading = false;
      },
      this.ShowError.bind(this)
    );
  }
  ShowError(data){
    
    this.flashMessagesService.show(`Ошибка ${JSON.stringify(data)}`, {
      cssClass: 'alert-danger',
      timeout: 5000,
    });
    this.isLoading = false;
  };
  
}
