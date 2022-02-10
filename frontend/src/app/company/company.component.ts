import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../services/company.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { FormService } from '../services/form.service';
import cloneDeepWith from 'lodash.clonedeepwith';
import { AuthService } from '../services/auth.service';
import { SearchService } from '../services/search.service';
import * as XLSX from 'xlsx';
import { FormlyFormOptions } from '@ngx-formly/core';
import { tap } from 'rxjs/operators';
import { HelperService } from '../services/helpers.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})
export class CompanyComponent implements OnInit {
  SearchText: string;
  list: Array<any> = [];
  SelectedItem: any = null;
  isLoading: boolean = false;
  form = new FormGroup({});
  model = {};
  options: FormlyFormOptions = {
    formState: {
      disabled: false,
      MoutherCompanyHide: false,
    },
  };
  fields: FormlyFieldConfig[];
  validationFields: FormlyFieldConfig[] = [];
  formName = 'companyForm';
  constructor(
    private dataService: CompanyService,
    private searchService: SearchService,
    private formservice: FormService,
    private authService: AuthService,
    private helper: HelperService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.formservice.getFormByName(this.formName).subscribe(
      (data: any) => {
        this.fields = this.mapfield(data as FormlyFieldConfig[]);
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  mapfield(fields) {
    return cloneDeepWith(fields, (item) => {
      if (item?.type == 'radio') {
        item.templateOptions.click = (field, event) => {
          let state = this.options.formState[field.key.toString()];
          this.options.formState[field.key.toString()] =
            state == null ? false : true;
          if (this.options.formState[field.key.toString()]) {
            this.options.formState[field.key.toString()] = false;
            delete this.model[item.key];
            this.model = { ...this.model };
          }
        };
      }
      if (item?.templateOptions?.label == 'Регистраційні дані') {
        let resident = item.fieldGroup.find((e) => {
          return e.key == 'IsResident';
        });
        resident.hooks = {
          onInit: (field?: FormlyFieldConfig) => {
            field.formControl.valueChanges
              .pipe(
                tap((value) => {
                  console.log(value);
                  if (value) {
                    delete this.model['MoutherCompany'][
                      'MoutherCompanyInfoForNonResident'
                    ];
                  }
                  field.parent.parent.fieldGroup.find((e) => {
                    return e.key == 'MoutherCompany';
                  }).fieldGroup[1].hide = value;
                })
              )
              .subscribe();
          },
        };
      }
      if (item?.key === 'ClearMonthIncome') {
        item.hooks = {
          onInit: (field?: FormlyFieldConfig) => {
            field.formControl.valueChanges
              .pipe(
                tap((value) => {
                  let clearMonthIncome = this.model['ClearMonthIncome'];
                  let monthIncome = this.model['MonthIncome'];
                  if (!clearMonthIncome || !monthIncome) {
                    this.model = {
                      ...this.model,
                      ['ProfitabilityOfSale']: 0,
                    };
                  }
                  else
                  this.model = {
                    ...this.model,
                    ['ProfitabilityOfSale']:
                      (clearMonthIncome / monthIncome) * 100,
                  };
                })
              )
              .subscribe();
          },
        };
      }
      if (item?.key === 'MonthIncome') {
        item.hooks = {
          onInit: (field?: FormlyFieldConfig) => {
            field.formControl.valueChanges
              .pipe(
                tap((value) => {
                  let clearMonthIncome = this.model['ClearMonthIncome'];
                  let monthIncome = this.model['MonthIncome'];
                  if (!clearMonthIncome || !monthIncome) {
                    this.model = {
                      ...this.model,
                      ['ProfitabilityOfSale']: 0,
                    };
                  }
                  else
                  this.model = {
                    ...this.model,
                    ['ProfitabilityOfSale']:
                      (clearMonthIncome / monthIncome) * 100,
                  };
                })
              )
              .subscribe();
          },
        };
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
          //use = answer in prod
          this.model = {
            ...this.model,
            [fieldKey]: { Description: data['result'] },
          };
        });
    };
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
    this.helper.cleanObject(model);
    console.log(model);
    //if selected item false than create person
    if (!this.SelectedItem) {
      let tempModel = {
        result: model,
        user: this.authService.currentUserValue.username,
      };
      this.dataService.create(tempModel).subscribe(
        (data: any) => {
          this.helper.ShowSuccess('Анкета успішно додана');
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
      let submitModel = {
        _id: this.SelectedItem._id,
        formDataResultId: this.SelectedItem.formDataResultId,
        user: this.authService.currentUserValue.username,
        result: model,
      };
      this.dataService.edit(submitModel).subscribe((data: any) => {
        this.helper.ShowSuccess('Анкета успішно оновлена');
        this.list = [
          data.result,
          ...this.list.filter((item) => item._id !== data.result._id),
        ];
        this.SelectedItem = data.result;
      });
    }
  }
  New() {
    this.model = {};
    this.SelectedItem = null;
  }
  SearchListItemOnClick(event, selectedItem) {
    this.isLoading = true;
    this.dataService.getFormData(selectedItem.formDataResultId).subscribe(
      (data: any) => {
        this.model = {
          ...data.result,
        };
        this.options.formState = {
          MoutherCompanyHide: this.model['IsResident'],
        };
        this.SelectedItem = selectedItem;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }
  Search(event: any) {
    // without type info
    if (event.target.value.toString().length > 4) {
      this.isLoading = true;
      this.searchService
        .search('company', event.target.value.toString())
        .subscribe(
          (data: any) => {
            this.list = data.result;
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
          }
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
          `${this.SelectedItem.shortName}_${this.SelectedItem.clientCode}.xlsx`
        );
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }
}
