import {  Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import cloneDeepWith from 'lodash.clonedeepwith';
import { HelperService } from './helpers.service';
@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(
    private http: HttpClient,
    private flashMessagesService: FlashMessagesService,
    private helperService: HelperService
  ) {}

  getFormByName(name) {
    // if (!localStorage.getItem(name)) {
    return this.http
      .get(`${environment.apiUrl}form/`, {
        params: new HttpParams().set('name', name),
      })
      .pipe(
        map((data) => {
          //localStorage.setItem(name, JSON.stringify({result:data['result'],expiresIn: 28800}));

          return this.mapFormFields(data['result'], name);
        })
      );
    // } else {
    //   return of(JSON.parse(localStorage.getItem(name)).result);
    // }
  }
  mapFormFields(fields, name) {
    fields = cloneDeepWith(fields, this.fieldsMap);
    if (name == 'personForm') {
      return cloneDeepWith(fields, this.personFieldsMap);
    }
    if (name == 'companyForm') {
      return cloneDeepWith(fields, this.companyFieldsMap);
    }
  }
  private fieldsMap = (item) => {
    if (item !== undefined) {
      if (item.key === 'Country') {
        item.templateOptions.options = this.helperService.getCountries();
      }
      if (item.key === 'Citizen') {
        item.templateOptions.options = this.helperService.getCountries();
      }
      if (item.key === 'Telephone') {
        item.templateOptions.keypress = this.onTelInputPress;
      }
      if (item.key === 'Birthday') {
        item.templateOptions.change = this.cheakBirthDay.bind(this);
      }
      if (item.type === 'radio') {
        item.templateOptions.valueProp = (o) => o.label;
      }
      if (item.type === 'select') {
        item.templateOptions.valueProp = (o) => o.label;
      }
      if (item.type === 'multicheckbox') {
        item.templateOptions.valueProp = (o) => o.label;
      }
    }
  };

  private personFieldsMap = (item) => {
    if (item !== undefined) {
      
    }
  };

  private companyFieldsMap = (item) => {
    if (item !== undefined) {
      if (item.key === 'BankAccounts') {
        item.validators = {
          arrcount: {
            expression: (c) => {
              return !c.value || c.value.length >= 1;
            },
            message: (error, field: FormlyFieldConfig) =>
              `Обовьязково повинен бути хоча б один рахунок в банку`,
          },
        };
      }
      if (item.key === 'ExecutiveDepartment') {
        item.validators = {
          arrcount: {
            expression: (c) => {
              return !c.value || c.value.length >= 1;
            },
            message: (error, field: FormlyFieldConfig) =>
              `Обовьязково повинен бути хоча б один орган`,
          },
        };
      }
      if (item.key === 'Director') {
        item.validators = {
          arrcount: {
            expression: (c) => {
              return !c.value || c.value.length >= 1;
            },
            message: (error, field: FormlyFieldConfig) =>
              `Обовьязково повинен бути хоча б один керівник`,
          },
        };
      }
    }
  };

  private cheakBirthDay(field: FormlyFieldConfig, event?: any) {
    let val = event.target.value;
    if (!val) {
      return;
    }
    const birthDay = new Date(val);
    let deadline1 = new Date(
      birthDay.getFullYear() + 25,
      birthDay.getMonth(),
      birthDay.getDate()
    );
    let deadline2 = new Date(
      birthDay.getFullYear() + 45,
      birthDay.getMonth(),
      birthDay.getDate()
    );
    let dif1 = deadline1.getFullYear() - new Date().getFullYear();
    let dif2 = deadline2.getFullYear() - new Date().getFullYear();

    if ((dif1 >= -1 && dif1 <= 1) || (dif2 >= -1 && dif2 <= 1)) {
      this.flashMessagesService.show(
        `Перевірте дату зміни фото на паспорті. Вона повинна бути ${deadline1.toLocaleDateString()} або ${deadline2.toLocaleDateString()}`,
        { cssClass: 'alert-danger', timeout: 10000 }
      );
    }
  }

  private onTelInputPress(field: FormlyFieldConfig, event?: any) {
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
}
