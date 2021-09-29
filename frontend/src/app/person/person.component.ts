import { Component, OnInit } from '@angular/core';
import { PersonService } from '../services/person.service';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
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
export class PersonComponent implements OnInit {
  SearchText: string;
  list: Array<any> = [];
  SelectedItem: any = null;
  isLoading: boolean = false;
  form = new FormGroup({});
  model = {};
  options: FormlyFormOptions = {
    formState: {
      disabled: true,
    },
  };
  fields: FormlyFieldConfig[];
  formName = 'personForm';

  constructor(
    private dataService: PersonService,
    private searchService: SearchService,
    private formservice: FormService,
    private flashMessagesService: FlashMessagesService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.isLoading = true;
    this.formservice.getFormByName(this.formName).subscribe((data: any) => {
      this.fields = this.mapfield(data);
      this.isLoading = false;
    }, this.ShowError);
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
      if (item?.key == 'IsEqualsToLive') {
        item.templateOptions.change =
          this.CopyRegistAdressToLiveAdress.bind(this);
      }
      if (item?.templateOptions?.label == 'Паспортні дані') {
        let inn = item.fieldGroup.find((e) => {
          return e.key == 'INN';
        });
        inn.expressionProperties = {
          'templateOptions.disabled': (model: any) => {
            return !model['IsResident'];
          },
        };
        item.fieldGroup.find((e) => {
          return e.key == 'IsResident';
        }).templateOptions.change = (field: FormlyFieldConfig, event?: any) => {
          if (!this.model['IsResident']) {
            delete this.model['INN'];
            this.model = { ...this.model };
          }
        };
      }
      if (item?.key == 'EmploymentType') {
        item.templateOptions.change = (
          field: FormlyFieldConfig,
          event?: any
        ) => {
          if (event.target.value == 'найманий працівник') {
            field.parent.fieldGroup.find((item) => {
              return item.key == 'EmploymentTypeDescribe';
            }).hide = !event.target.checked;
            if (!event.target.checked) {
              this.model['EmploymentTypeDescribe'] = null;
            }
          }
        };
      }
      if (item?.key == 'CheckList') {
        item.fieldGroup.map((i) => {
          if (i.type == 'radio') {
            i.templateOptions.click = (field, event) => {
              let state = this.options.formState[field.key.toString()];
              this.options.formState[field.key.toString()] =
                state == null ? false : true;
              if (this.options.formState[field.key.toString()]) {
                this.options.formState[field.key.toString()] = false;
                delete this.model[item.key][field.key.toString()];
                this.model = { ...this.model };
              }
            };
          }
        });
      }
      if (item?.key === 'CheckClientByQuestion') {
        item.fieldGroup[1].templateOptions.onClick = function () {
          let answers = this.dataService.getRate(
            this.SelectedItem.formDataResultId
          );
          this.model['CheckClientByQuestion']['QuestionDescription'] =
            JSON.stringify(answers);
          this.model = { ...this.model };
        };
      }
    });
  }

  private GetRate() {}
  private CopyRegistAdressToLiveAdress(field: FormlyFieldConfig, event?: any) {
    if (event.target.checked) {
      this.model = { ...this.model, Live: this.model['Regist'] };
    }
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

  cleanObject(object) {
    Object.entries(object).forEach(([k, v]) => {
      if (v && typeof v === 'object') {
        this.cleanObject(v);
      }
      if (
        (v && typeof v === 'object' && !Object.keys(v).length) ||
        v === null ||
        v === undefined
      ) {
        if (Array.isArray(object)) {
          object.splice(k as any, 1);
        } else {
          delete object[k];
        }
      }
    });
    return object;
  }

  Submit(model) {
    console.log(model);
    //if selected item true than create person
    if (!this.SelectedItem) {
      this.cleanObject(model);
      let tempModel = {
        result: model,
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
        (err) => {
          this.isLoading = false;
        }
      );
    }
    //if selected item true than edit person
    else {
      this.cleanObject(model);
      let submitModel = {
        _id: this.SelectedItem._id,
        formDataResultId: this.SelectedItem.formDataResultId,
        result: model,
      };

      this.dataService.edit(submitModel).subscribe((data: any) => {
        this.flashMessagesService.show('Анкета успешно обновлена', {
          cssClass: 'alert-success',
          timeout: 5000,
        });
        this.list = [
          data.result,
          ...this.list.filter((item) => item._id !== data.result._id),
        ];
        this.SelectedItem = data.result;
      });
    }
  }
  NewPerson() {
    this.model = {};
    this.SelectedItem = null;
  }
  SearchItemOnClick(event, selectedItem) {
    this.isLoading = true;
    this.dataService
      .getFormData(selectedItem.formDataResultId)
      .subscribe((data: any) => {
        this.model = {
          ...data.result,
        };
        this.SelectedItem = selectedItem;
        this.isLoading = false;
      }, this.ShowError);
  }
  onKey(event: any) {
    // without type info
    if (event.target.value.toString().length > 4) {
      this.isLoading = true;
      this.searchService
        .search('person', event.target.value.toString())
        .subscribe((data: any) => {
          this.list = data.result;
          this.isLoading = false;
        }, this.ShowError);
    }
  }
  Download() {
    this.isLoading = true;
    this.dataService.getFile(this.SelectedItem._id).subscribe((data: any) => {
      const wb = XLSX.read(data.result, { type: 'base64' });
      XLSX.writeFile(
        wb,
        `${this.SelectedItem.family}_${this.SelectedItem.name}_${this.SelectedItem.surname}.xlsx`
      );
      this.isLoading = false;
    }, this.ShowError.bind(this));
  }
  ShowError(data) {
    this.flashMessagesService.show(`Ошибка ${JSON.stringify(data)}`, {
      cssClass: 'alert-danger',
      timeout: 5000,
    });
    this.isLoading = false;
  }
}
