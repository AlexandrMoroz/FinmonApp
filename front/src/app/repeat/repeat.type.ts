import { Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';
@Component({
  selector: 'formly-repeat-section',
  template: `
    <div *ngFor="let field of field.fieldGroup; let i = index" class="col">
      <div class="col">
        <div class="d-flex justify-content-center align-items-center">
          <h2 class="mb-0">{{ to.title }} №{{ i+1 }}</h2>
          <button class="btn btn-danger ml-2" type="button" (click)="remove(i)">
            Удалить
          </button>
        </div>
        <formly-field class="col" [field]="field"></formly-field>
      </div>
    </div>
    <div style="margin:30px 0;">
      <button class="btn btn-primary" type="button" (click)="add()">
        {{ to.addText }}
      </button>
    </div>
  `,
})
export class RepeatComponent extends FieldArrayType {}
