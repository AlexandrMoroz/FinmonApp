import { Component, OnInit } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'repeat-one-row',
  template: `
  <div class="alert alert-danger" role="alert" *ngIf="formControl.errors">
    <formly-validation-message [field]="field"></formly-validation-message>
  </div>
  <div class="d-flex flex-column justify-content-center">
    <label class="mb-1">{{ to.title }}</label>
    <div *ngFor="let field of field.fieldGroup; let i = index" class="d-flex justify-content-center align-items-baseline">
      <formly-field class="{{to.inputClass}}" [field]="field"></formly-field>
      <button class="btn btn-danger {{to.cancelButtonClass}}" type="button" (click)="remove(i)">
      -
      </button>
    </div>
    <button class="btn btn-primary {{to.addButtonClass}} " type="button" (click)="add()">+</button>

    </div>
  `,
})
export class RepeatOneRowComponent extends FieldArrayType {}
