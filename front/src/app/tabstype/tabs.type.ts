import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'tabs-component',
  template: `
  <tabs>
    <tab tabTitle="{{item.templateOptions.label}}" *ngFor="let item of field.fieldGroup;">
      <p> content1</p>
    </tab> 
  <tabs>
  `,
})
export class TabsType extends FieldType {}
