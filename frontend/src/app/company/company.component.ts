import {
  AfterContentInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { CompanyService } from '../services/company.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FormService } from '../services/form.service';
import cloneDeepWith from 'lodash.clonedeepwith';
import { HelperService } from '../services/helpers.service';
import { AuthService } from '../services/auth.service';
import { SearchService } from '../services/search.service';
import * as XLSX from 'xlsx';
import { FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})
export class CompanyComponent implements OnInit {
  searchText: string;
  list: Array<any> = [];
  selectedItem: any = null;
  isLoading: boolean = false;
  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[];
  formName = 'companyForm';
  options: FormlyFormOptions = {
    formState: {
      disabled: false,
    },
  };
  constructor(
    private dataService: CompanyService,
    private searchService: SearchService,
    private formservice: FormService,
    private flashMessagesService: FlashMessagesService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.formservice.getFormByName(this.formName).subscribe(
      (data: any) => {
        this.fields = this.mapfield(data);
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  mapfield(fields) {
    return cloneDeepWith(fields, (item) => {
      if (item.templateOptions?.label === 'Місце реєстрації') {
        item.fieldGroup = item.fieldGroup.map((element) => {
          if (element.key == 'Country') {
            element.templateOptions.change = (
              field: FormlyFieldConfig,
              event?: any
            ) => {
              if (
                event.target.selectedOptions[0].value.split(':')[1].trim() ==
                'Україна'
              ) {
                this.options.formState.disabled = false;
              } else {
                delete this.model['RegistNumber'];
                delete this.model['ClientCode'];
                this.model = { ...this.model };
                this.options.formState.disabled = true;
              }
            };
          }
          return element;
        });
      }
    });
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
    
    for (let [key, value] of Object.entries(model)) {
      if (this.isObject(value)) {
        this.cheakObjectIsEmpty(value)
          ? delete model[key]
          : this.deleteAllEmptyElement(value);
      }
      //if arr[] delete it
      if (Array.isArray(value)) {
        if (this.cheakArrayIsEmpty(value)) {
          delete model[key];
        }
        //if arr[null,1,null] => arr[1]
        else {
          model[key] = value.map((item) => {
            if (item != null || item != undefined) {
              return item;
            }
          });
        }
      } else {
        this.cheakArrayIsEmpty(value) || this.cheakObjectIsEmpty(value)
          ? delete model[key]
          : '';
      }
    }
  }
  Submit(model) {
    //if selected item true than create person
    if (!this.selectedItem) {
      this.deleteAllEmptyElement(model);
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
          this.selectedItem = data.result;
        },
        (error) => {
          this.isLoading = false;
        }
      );
    }
    //if selected item true than create person
    else {
      this.deleteAllEmptyElement(model);
      let submitModel = {
        _id: this.selectedItem._id,
        formDataResultId: this.selectedItem.formDataResultId,
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
          this.selectedItem = data.result;
        },
        (error) => {
          this.isLoading = false;
        }
      );
    }
  }
  New() {
    this.model = {};
    this.selectedItem = null;
  }
  SearchListItemOnClick(event, selectedItem) {
    this.isLoading = true;
    this.dataService.getFormData(selectedItem.formDataResultId).subscribe(
      (data: any) => {
        this.model = {
          ...data.result,
        };
        this.selectedItem = selectedItem;
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
  DownloadXlSXFile() {
    this.isLoading = true;
    this.dataService.getFile(this.selectedItem._id).subscribe(
      (data: any) => {
        const wb = XLSX.read(data.result, { type: 'base64' });
        
        XLSX.writeFile(
          wb,
          `${this.selectedItem.shortName}_${this.selectedItem.registNumber}.xlsx`
        );
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }
}
