import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesRepresentativeComponent } from './companies-representative.component';

describe('CompaniesRepresentativeComponent', () => {
  let component: CompaniesRepresentativeComponent;
  let fixture: ComponentFixture<CompaniesRepresentativeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompaniesRepresentativeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesRepresentativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
