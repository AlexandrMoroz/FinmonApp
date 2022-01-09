import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { CompanyService } from '../services/company.service';
import { PersonService } from '../services/person.service';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  isLoading: boolean = false;
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

              this.model = {
                ...this.model,
                TerroristSearchResult: JSON.stringify(data['result']['terrorist']),
                SanctionSearchResult: JSON.stringify(data["result"]['sanction']),
              };
              console.log(this.model);
            });
        },
      },
      expressionProperties: {
        'templateOptions.disabled': (model: any) => {
          return !model['Category'];
        },
      },
    },
    {
      className: 'col-6 p-3',
      key: 'TerroristSearchResult',
      type: 'textarea',
      templateOptions: {
        label: 'Результат пошуку в базі террорістів',
        rows: 5,
      },
      expressionProperties: {
        'templateOptions.disabled': (model: any) => {
          return !model['Category'];
        },
      },
    },
    {
      className: 'col-6 p-3',
      key: 'SanctionSearchResult',
      type: 'textarea',
      templateOptions: {
        label: 'Результат пошуку в базі підсанкційних осіб',
        rows: 5,
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
