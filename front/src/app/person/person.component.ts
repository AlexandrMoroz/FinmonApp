import { Component, EventEmitter, Output } from '@angular/core';
import { PersonService } from '../services/person.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FormService } from '../services/form.service';
import cloneDeepWith from 'lodash.clonedeepwith';
import { HelperService } from '../services/helpers.service';
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
    private helperService: HelperService,
    private formservice: FormService,
    private flashMessagesService: FlashMessagesService,
    private authService: AuthService
  ) {
    this.isLoading = true;
    this.formservice.getFormByName(this.formName).subscribe(
      (data: any) => {
        this.fields = this.mapFormFields(data);
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

  mapFormFields(fields) {
    return cloneDeepWith(fields, (item) => {
      if (item !== undefined) {
        if (item.key == 'FOP') {
          item.hideExpression = (model: any, formState: any) => {
            return !this.model['isFOP'];
          };
        }
        if (item.key == 'PEP') {
          item.hideExpression = (model: any, formState: any) => {
            return !this.model['isPEP'];
          };
        }
        if (item.key === 'Country') {
          let cout = this.helperService.getCountries();
          item.templateOptions.options = cout;
          item.defaultValue = 'Україна';
        }
        if (item.key === 'Telephone') {
          item.templateOptions.keypress = this.onTelInputPress.bind(this);
        }
        if (item.key === 'GovRegDocDateRelise') {
          item.templateOptions.change = (
            field: FormlyFieldConfig,
            event?: any
          ) => {
            console.log(event.target.value);
            const firstDate = new Date(event.target.value);
            const secondDate = new Date();

            let ClientAge = this.CalDateBetween(secondDate, firstDate);
            let FOP = this.model['FOP'];
            FOP['ClientAge'] = ClientAge;
            this.model = { ...this.model, FOP };
          };
        }
        if (item.key === 'Birthday') {
          item.templateOptions.change = this.cheakBirthDay.bind(this);
        }
        if (item.type === 'textarea') {
          item.templateOptions.keypress = this.ResizeTextarea.bind(this);
        }
        if (item.type === 'select') {
          item.templateOptions.valueProp = (o) => o.label;
        }
      }
    });
  }

  cheakBirthDay(field: FormlyFieldConfig, event?: any) {
    let val = event.target.value;
    if (!val) {
      return;
    }
    const birthDay = new Date(val);
    var year = birthDay.getFullYear();
    var month = birthDay.getMonth();
    var day = birthDay.getDate();
    var deadline1 = new Date(year + 25, month, day);
    var deadline2 = new Date(year + 45, month, day);

    if (
      (deadline1.getFullYear() - new Date().getFullYear() >= -1 &&
        deadline1.getFullYear() - new Date().getFullYear() <= 1) ||
      (deadline2.getFullYear() - new Date().getFullYear() >= -1 &&
        deadline2.getFullYear() - new Date().getFullYear() <= 1)
    ) {
      this.flashMessagesService.show(
        `Проверте дату смены фото на паспорт. Он должна быть ${deadline1.toLocaleDateString()} или ${deadline2.toLocaleDateString()}`,
        { cssClass: 'alert-danger', timeout: 10000 }
      );
    }
  }
  CalDateBetween(date1, date2) {
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
    message += days + ' days ';
    if (months > 0 || years > 0) {
      message += months + ' months ';
    }
    if (years > 0) {
      message += years + ' years ago';
    }

    return message;
  }
  ResizeTextarea(field, event, useEvent) {
    event.target.style.height = '1px';
    event.target.style.height = 25 + event.target.scrollHeight + 'px';
  }
  onTelInputPress(field: FormlyFieldConfig, event?: any) {
    let newVal = event.target.value.replace(/\D/g, '');
    if (newVal.length === 0) {
      newVal = '';
    } else if (newVal.length <= 3) {
      newVal = newVal.replace(/^(\d{0,3})/, '($1)');
    } else if (newVal.length <= 6) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
    } else if (newVal.length <= 9) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
    } else {
      newVal = newVal.substring(0, 9);
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
    }
    event.target.value = newVal;
  }
  cheakObjectIsEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }
  cheakArrayIsEmpty(obj) {
    return obj?.length == 0;
  }
  isObject(a) {
    return !!a && a.constructor === Object;
  }
  deleteAllEmptyElement(model) {
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
  onSubmit(model) {
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
    //if selected item true than create person
    else {
      this.deleteAllEmptyElement(model);
      let submitModel = {
        _id: this.SelectedItem._id,
        FormDataResultId: this.SelectedItem.FormDataResultId,
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
  NewPerson() {
    this.model = {};
    this.SelectedItem = null;
  }
  ItemOnClick(event, selectedItem) {
    this.isLoading = true;
    this.dataService.getFormData(selectedItem.FormDataResultId).subscribe(
      (data: any) => {
        this.model = {
          ...data.result.result,
        };
        this.SelectedItem = selectedItem;
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.flashMessagesService.show(`Ошибка ${error.messages}`, {
          cssClass: 'alert-danger',
          timeout: 5000,
        });
        this.isLoading = false;
      }
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
  download() {
    this.isLoading = true;
    this.dataService.getFile(this.SelectedItem.FormDataResultId).subscribe(
      (data: any) => {
        const wb = XLSX.read(data.result, { type: 'base64' });
        XLSX.writeFile(
          wb,
          `${this.SelectedItem.family}_${this.SelectedItem.name}_${this.SelectedItem.surname}.xlsx`
        );
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.flashMessagesService.show(`Ошибка ${error.messages}`, {
          cssClass: 'alert-danger',
          timeout: 5000,
        });
        this.isLoading = false;
      }
    );
  }
}
