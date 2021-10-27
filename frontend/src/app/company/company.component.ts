import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../services/company.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FormService } from '../services/form.service';
import cloneDeepWith from 'lodash.clonedeepwith';
import { AuthService } from '../services/auth.service';
import { SearchService } from '../services/search.service';
import * as XLSX from 'xlsx';
import { FormlyFormOptions } from '@ngx-formly/core';
import { tap } from 'rxjs/operators';

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
  formName = 'companyForm';
  constructor(
    private dataService: CompanyService,
    private searchService: SearchService,
    private formservice: FormService,
    private flashMessagesService: FlashMessagesService,
    private authService: AuthService
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
      if (item?.key === 'CheckClientByQuestion') {
        item.fieldGroup[1].templateOptions.onClick = () => {
          if (!this.SelectedItem) {
            this.flashMessagesService.show('Оберіть клієнта', {
              cssClass: 'alert-danger',
              timeout: 5000,
            });
            return;
          }
          this.dataService
            .getRate(this.SelectedItem.formDataResultId)
            .subscribe((data) => {
              this.model = {
                ...this.model,
                CheckClientByQuestion: { QuestionDescription: data['result'] },
              };
            });
        };
      }
    });
  }
  recurseCleanObj(object) {
    Object.entries(object).forEach(([k, v]) => {
      if (v && typeof v === 'object') {
        this.recurseCleanObj(v);
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
  cleanObject(object) {
    delete object['CheckClientByQuestion'];
    console.log(object);
    if (object['IsResident']) {
      delete object['MoutherCompany']['MoutherCompanyInfoForNonResident'];
    }
    return this.recurseCleanObj(object);
  }
  Submit(model) {
    //if selected item true than create person
    if (!this.SelectedItem) {
      this.cleanObject(model);
      console.log(model);
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
        (err) => {
          this.isLoading = false;
        }
      );
    }
    //if selected item true than edit person
    else {
      this.cleanObject(model);
      console.log(model);
      let submitModel = {
        _id: this.SelectedItem._id,
        formDataResultId: this.SelectedItem.formDataResultId,
        user: this.authService.currentUserValue.username,
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
