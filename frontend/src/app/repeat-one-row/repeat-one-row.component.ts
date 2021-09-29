import { Component, OnInit } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'repeat-one-row',
  template: `
  <div class="alert alert-danger" role="alert" *ngIf="formControl.errors">
    <formly-validation-message [field]="field"></formly-validation-message>
  </div>
  <div class="d-flex flex-column mb-3 justify-content-center">
    <label class="mb-3">{{ to.title }}</label>
    <div *ngFor="let field of field.fieldGroup; let i = index" class="d-flex justify-content-center align-items-baseline">
      <formly-field class="{{to.inputClass}}" [field]="field"></formly-field>
      <button nbButton hero status="danger" type="button"  class="{{to.cancelButtonClass}}" size="small" (click)="remove(i)">-</button>
    </div>
    <button nbButton hero status="primary" type="button"  class="{{to.addButtonClass}}" (click)="add()">+</button>
  </div>
  `,
})
export class RepeatOneRowComponent extends FieldArrayType {
}
