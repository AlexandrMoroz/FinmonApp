import { Component,ChangeDetectionStrategy } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'tabs-component',
  template: `
  
    <mat-tab-group>
      <mat-tab
        *ngFor="let tab of field.fieldGroup; let i = index; let last = last"
        [label]="tab.templateOptions.label"
        [ngClass]="{invalid: i !== 0 && !isValid(field.fieldGroup[i])}"
      >
        <formly-field [field]="tab"></formly-field>
      </mat-tab>
    </mat-tab-group>
  `,
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsType  extends FieldType {
  isValid(field: FormlyFieldConfig) {
    if (field.key) {
      // console.log(false)
      return field.formControl.valid;
    }
    // console.log(true)
    return field.fieldGroup.every((f) => this.isValid(f));
  }
}
