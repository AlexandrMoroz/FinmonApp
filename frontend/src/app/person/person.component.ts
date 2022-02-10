import { Component, OnInit } from '@angular/core';
import { PersonService } from '../services/person.service';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormService } from '../services/form.service';
import cloneDeepWith from 'lodash.clonedeepwith';
import { SearchService } from '../services/search.service';
import * as XLSX from 'xlsx';
import { HelperService } from '../services/helpers.service';
import { map, tap } from 'rxjs/operators';

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
      FOPGovRegDocDateReliseChange: false,
      isFOP:true
    },
  };
  fields: FormlyFieldConfig[];
  formName = 'personForm';

  constructor(
    private dataService: PersonService,
    private searchService: SearchService,
    private formservice: FormService,
    private helper: HelperService
  ) {}
  ngOnInit(): void {
    this.isLoading = true;
    this.formservice.getFormByName(this.formName).subscribe((data: any) => {
      this.fields = this.mapfield(data);
      this.isLoading = false;
    }, this.helper.ShowError);
  }

  private mapfield(fields) {
    return cloneDeepWith(fields, (item) => {
      if (item?.key === 'GovRegDocDateRelise') {
        item.hooks = {
          onInit: (field?: FormlyFieldConfig) => {
            field.formControl.valueChanges
              .pipe(
                map((value) => {
                  if (value) {
                    if (!this.options.formState.FOPGovRegDocDateReliseChange) {
                      this.options.formState.FOPGovRegDocDateReliseChange =
                        true;
                      field.parent.fieldGroup.forEach((element) => {
                        if (element.key == 'RegistrationNumber') {
                          element.templateOptions.required = true;
                        }
                        if (element.key == 'GovRegDocDateRelise') {
                          element.templateOptions.required = true;
                        }
                      });
                    }
                    const firstDate = new Date(value);
                    const secondDate = new Date();
                    let ClientAge = this.CalDateBetween(secondDate, firstDate);
                    this.model['FOP']['ClientAge'] = ClientAge;
                    this.model = {
                      ...this.model,
                    };
                  } else {
                    let govregdate = this.model['FOP']['GovRegDocDateRelise'];
                    delete this.model['FOP'];
                    this.model = {
                      ...this.model,
                      FOP:{["GovRegDocDateRelise"]:govregdate}
                    };
                    this.options.formState.FOPGovRegDocDateReliseChange = false;
                    field.parent.fieldGroup.forEach((element) => {
                      if (element.key == 'RegistrationNumber') {
                        element.templateOptions.required = false;
                      }
                      if (element.key == 'GovRegDocDateRelise') {
                        element.templateOptions.required = false;
                      }
                    });
                  }
                  field.formControl.parent.parent.controls[
                    'BankAccount'
                  ].updateValueAndValidity();
                })
              )
              .subscribe();
          },
        };
      }
      
      if (item.key == 'BankAccount') {
        item.validators = {
          arrcount: {
            expression: (c: FormControl) => {
              if (this.options.formState.FOPGovRegDocDateReliseChange)
                return !c.value || c.value.length >= 1;
              return true;
            },
            message: `Обов'язково повинен бути хоча б один рахунок в банку`,
          },
        };
      }
      if (item?.key == 'IsEqualsToLive') {
        item.templateOptions.change =
          this.CopyRegistAdressToLiveAdress.bind(this);
      }
      if (item?.templateOptions?.label == 'Паспортні дані') {
        let IsResident = item.fieldGroup.find((e) => {
          return e.key == 'IsResident';
        });
        IsResident.hooks = {
          onInit: (field?: FormlyFieldConfig) => {
            field.formControl.valueChanges
              .pipe(
                map((value) => {
                  let citizen = field.parent.fieldGroup.find(
                    (item) => item.key == 'Citizen'
                  );
                  let inn = field.parent.fieldGroup.find(
                    (item) => item.key === 'INN'
                  );
                  if (value) {
                    inn.templateOptions.required = true;
                    citizen.templateOptions.required = false;
                  } else {
                    inn.templateOptions.required = false;
                    citizen.templateOptions.required = true;
                  }
                })
              )
              .subscribe();
          },
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
      if (item?.key === 'CheckClientRisk') {
        this.SetButtonHandler(item, 'CheckClientRisk', 'Risk');
      }
      if (item?.key === 'CheckClientReputation') {
        this.SetButtonHandler(item, 'CheckClientReputation', 'Reputation');
      }
      if (item?.key === 'CheckClientFinansialRisk') {
        this.SetButtonHandler(
          item,
          'CheckClientFinansialRisk',
          'FinansialRisk'
        );
      }
    });
  }

  private SetButtonHandler(item, fieldKey, funcName) {
    item.fieldGroup[1].templateOptions.onClick = () => {
      if (!this.SelectedItem) {
        this.helper.ShowError('Оберіть клієнта');
        return;
      }
      this.dataService
        .calcAnswer(this.SelectedItem.formDataResultId, funcName)
        .subscribe((data) => {
          this.model = {
            ...this.model,
            [fieldKey]: { Description: data['result'] },
          };
        });
    };
  }
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
    let months = Math.floor(days / 30);
    let years = Math.floor(months / 12);

    months = Math.floor(months % 12);
    days = Math.floor(days % 30);
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

  Submit(model) {
    if (!this.form.valid) {
      let validation = '';
      cloneDeepWith(this.fields, (item) => {
        if (
          item?.formControl?.errors?.length != 0 &&
          item?.formControl?.errors != null &&
          item?.model
        ) {
          validation += this.helper.getErrorMessage(item) + '<br/>';
        }
      });
      this.helper.ShowError(validation);
      return;
    }
    if (this.model['FOP']) delete this.model['FOP']['ClientAge'];

    delete this.model['CheckClientRisk'];
    delete this.model['CheckClientReputation'];
    delete this.model['CheckClientFinansialRisk'];

    console.log(model);
    //if selected item true than create person
    if (!this.SelectedItem) {
      this.helper.cleanObject(model);
      let tempModel = {
        result: model,
      };
      this.dataService.create(tempModel).subscribe(
        (data: any) => {
          this.helper.ShowSuccess('Анкета успішно додана');
          this.isLoading = false;
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
      this.helper.cleanObject(model);
      let submitModel = {
        _id: this.SelectedItem._id,
        formDataResultId: this.SelectedItem.formDataResultId,
        result: model,
      };

      this.dataService.edit(submitModel).subscribe((data: any) => {
        this.helper.ShowSuccess('Анкета успішно оновлена');
        this.isLoading = false;
        this.list = [
          data.result,
          ...this.list.filter((item) => item._id !== data.result._id),
        ];
        this.SelectedItem = data.result;
      });
    }
  }
  NewPerson() {
    //this.isLoading = true;
    this.model = {};
    this.SelectedItem = null;
    this.options.formState.FOPGovRegDocDateReliseChange = false;

    // this.formservice.getFormByName(this.formName).subscribe((data: any) => {
    //   this.fields = this.mapfield(data);
    //   this.isLoading = false;
    // }, this.helper.ShowError);
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
      }, this.helper.ShowError);
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
        }, this.helper.ShowError);
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
    }, this.helper.ShowError);
  }
}
