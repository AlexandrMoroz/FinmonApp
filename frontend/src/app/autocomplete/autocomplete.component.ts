import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  OnInit,
} from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperService } from '../services/helpers.service';

@Component({
  selector: 'autocomplete',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent extends FieldType implements OnInit {
  inputOptions: string[];
  filteredinputOptions$: Observable<string[]>;

  @ViewChild('autoInput') input;
  get type() {
    return this.to.type || 'text';
  }
  constructor(helperService: HelperService) {
    super();
    helperService.getTypeOfBusiness().subscribe((data) => {
      this.inputOptions = data;
    });
  }
  ngOnInit() {
    this.filteredinputOptions$ = of(this.inputOptions);
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.inputOptions.filter((optionValue) =>
      optionValue.toLowerCase().includes(filterValue)
    );
  }

  getFilteredinputOptions(value: string): Observable<string[]> {
    return of(value).pipe(map((filterString) => this.filter(filterString)));
  }

  onChange() {
    this.filteredinputOptions$ = this.getFilteredinputOptions(
      this.input.nativeElement.value
    );
  }

  onSelectionChange($event) {
    this.filteredinputOptions$ = this.getFilteredinputOptions($event);
  }
}
