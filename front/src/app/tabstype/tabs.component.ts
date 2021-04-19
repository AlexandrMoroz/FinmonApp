import { Component } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'tabs-component',
  template: `
    <mat-tab-group>
      <mat-tab
        *ngFor="let tab of field.fieldGroup; let i = index; let last = last"
        [label]="tab.templateOptions.label"
      >
        <formly-field [field]="tab"></formly-field>
      </mat-tab>
    </mat-tab-group>
  `,
  styleUrls: ['./tabs.component.scss'],
})
export class TabsType extends FieldType {
  isValid(field: FormlyFieldConfig) {
    if (field.key) {
      return field.formControl.valid;
    }

    return field.fieldGroup.every((f) => this.isValid(f));
  }
}
