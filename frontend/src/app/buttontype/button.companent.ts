import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'buttonType',
  templateUrl: './button.component.html',
})
export class ButtonType extends FieldType {
  onClick($event) {
    if (this.to.onClick) {
      this.to.onClick($event);
    }
  }
}
