import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { CompanyService } from '../services/company.service';
import { PersonService } from '../services/person.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
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
        change: (field: FormlyFieldConfig, event?: any) => {},
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
        change: (field: FormlyFieldConfig, event?: any) => {},
      },
    },
    {
      className: 'col-6 p-3',
      key: 'TerroristSearchResult',
      type: 'textarea',
      templateOptions: { label: 'Результат пошуку в базі террорістів' },
    },
    {
      className: 'col-6 p-3',
      key: 'SanctionSearchResult',
      type: 'textarea',
      templateOptions: { label: 'Результат пошуку в базі підсанкційних осіб' },
    },
  ];
  constructor(
    private personService: PersonService,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {}
  Submit(model){
    
  }
}
