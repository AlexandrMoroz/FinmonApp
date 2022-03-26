import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  isLoading: boolean = false;
  terrorist: Array<string>;
  sanction: Array<string>;
  form = new FormGroup({});
  model = {};
  options: FormlyFormOptions = {};
  fields = [
    {
      className: 'col-3 p-3',
      key: 'Category',
      type: 'radio',
      templateOptions: {
        valueProp: (o) => o.value,
        label: 'Пошук в категорії',
        options: [
          {
            label: 'Фізичні особи',
            value: 1,
          },
          {
            label: 'Юридичні  особи',
            value: 2,
          },
        ],
      },
    },
    {
      className: 'col-9 p-3',
      key: 'SearchText',
      type: 'input',
      templateOptions: {
        label: 'Результат пошуку',
        change: (field: FormlyFieldConfig, event?: any) => {
          let type = this.model['Category'] == 1 ? 'person' : 'company';
          this.searchService
            .externalBaseSearch(type, event.target.value)
            .subscribe((data) => {
              console.log(data);
              this.terrorist = data['terrorist'];
              this.sanction = data['sanction'];
            });
        },
      },
      expressionProperties: {
        'templateOptions.disabled': (model: any) => {
          return !model['Category'];
        },
      },
    },
  ];
  constructor(private searchService: SearchService) {}

  ngOnInit(): void {}
  Submit(model) {}
}
