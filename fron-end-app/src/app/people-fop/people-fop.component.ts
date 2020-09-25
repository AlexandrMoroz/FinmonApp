import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FormService } from '../services/form.service';
import cloneDeepWith from 'lodash.clonedeepwith';
import { PeopleFopService } from '../services/people-fop.service';
import { HelperService } from '../services/helpers.service';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-people-fop',
  templateUrl: './people-fop.component.html',
  styleUrls: ['./people-fop.component.scss'],
})
export class PeopleFopComponent implements OnInit {
  SearchText: string;
  list: Array<any> = [];
  SelectedListItem: any = null;
  isLoading: boolean = false;
  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[];
  formName = 'fopForm';
  constructor(
    private dataService: PeopleFopService,
    private helperService: HelperService,
    private formservice: FormService,
    private flashMessagesService: FlashMessagesService,
    private authService:AuthService
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
    this.dataService.getAll().subscribe(
      (data: any) => {
        this.list = [...data.result];
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
    let a = fields.map((item) => {
      if (item.key == 'Live') {
        item.hideExpression = this.hideOnClickRegist.bind(this);
      }
      if (item.key == 'Regist') {
        item.hideExpression = this.hideOnClickLive.bind(this);
      }
      if (item.key === 'BirthDay') {
        item.templateOptions.change = this.cheakBirthDay.bind(this);
      }
      if (item.key === 'Representative' || item.key === 'Beneficiaries') {
        // item.fieldArray.fieldGroup.find(
        //   (i) => i.key === 'Live'
        // ).hideExpression = this.hideOnClickRegist.bind(item);

        // item.fieldArray.fieldGroup.find(
        //   (i) => i.key === 'Regist'
        // ).hideExpression = this.hideOnClick.bind(item);
      }
      return item;
    });

    return cloneDeepWith(a, (item) => {
      if (item !== undefined) {
        if (item.key === 'Country') {
          let cout=this.helperService.getCountries()
          item.templateOptions.options = cout
        }
        if (item.key === 'telephoneNumber') {
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

            let ClientAge = this.CalDate(secondDate, firstDate);
            let FOP = this.model['FOP'];
            FOP['ClientAge'] = ClientAge;
            this.model = { ...this.model, FOP };
          };
        }
        if (item.key === 'BirthDay') {
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

  hideOnClickRegist(model: any, formState: any) {
    if (
      this.model['Regist']['Country'] ||
      this.model['Regist']['City'] ||
      this.model['Regist']['State'] ||
      this.model['Regist']['District'] ||
      this.model['Regist']['Street'] ||
      this.model['Regist']['House']
    ) {
      return true;
    }
    return false;
  }
  hideOnClickLive(model:any, formState:any){
    if (
      this.model['Live']['Country'] ||
      this.model['Live']['City'] ||
      this.model['Live']['State'] ||
      this.model['Live']['District'] ||
      this.model['Live']['Street'] ||
      this.model['Live']['House']
    ) {
      return true;
    }

    return false;
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
  CalDate(date1, date2) {
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
    console.log(123123);
    let newVal = event.target.value.replace(/\D/g, '');
    if (false && newVal.length <= 6) {
      newVal = newVal.substring(0, newVal.length - 1);
    }
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
    // this.ngControl.valueAccessor.writeValue(newVal);
  }
  ngOnInit(): void {}
  onSubmit(model) {
    //is create
    if (!this.SelectedListItem) {
      this.dataService.create(model).subscribe(
        (data: any) => {
          this.flashMessagesService.show('Анкета успешно добавлена', {
            cssClass: 'alert-success',
            timeout: 5000,
          });
          this.list = [
            data.result,
            ...this.list.filter((item) => item._id !== data.result._id),
          ];
          this.SelectedListItem = data.result;
        },
        (error) => {
          console.log(error);
          this.flashMessagesService.show(`Ошибка ${error.messages}`, {
            cssClass: 'alert-danger',
            timeout: 5000,
          });
        }
      );
    }//is edit 
    else {
      let submitModel = {
        _id: this.SelectedListItem._id,
        FormDataResultId: this.SelectedListItem.FormDataResultId,
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
          this.SelectedListItem = data.result;
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
  NewForm() {
    this.model = {};
    this.SelectedListItem = null;
  }
  ItemOnClick(event, selectedItem) {
    this.isLoading = true;
    this.dataService.getFormData(selectedItem.FormDataResultId).subscribe(
      (data: any) => {
        this.model = {
          ...data.result.result,
        };
        this.SelectedListItem = selectedItem;
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
