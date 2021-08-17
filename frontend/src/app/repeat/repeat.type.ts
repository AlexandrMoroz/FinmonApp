import { Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';
@Component({
  selector: 'formly-repeat-section',
  template: `
    <div class="alert alert-danger" role="alert" *ngIf="formControl.errors">
      <formly-validation-message [field]="field"></formly-validation-message>
    </div>
    <div *ngFor="let field of field.fieldGroup; let i = index" class="col">
      <div class="col">
        <div class="d-flex justify-content-center align-items-center">
          <h2 class="mb-0">{{ to.title }} №{{ i+1 }}</h2>
          <button nbButton hero status="danger" class="ml-2" type="button" (click)="remove(i)">
            Видалити
          </button>
        </div>
        <formly-field class="col" [field]="field"></formly-field>
      </div>
    </div>
    <div style="margin:30px 0;">
      <button nbButton hero status="primary" type="button" (click)="add()">
        {{ to.addText }}
      </button>
     
    </div>
  `,
})
export class RepeatComponent extends FieldArrayType {}
