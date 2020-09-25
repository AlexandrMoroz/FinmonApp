import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesNotResidentComponent } from './companies-not-resident.component';

describe('CompaniesNotResidentComponent', () => {
  let component: CompaniesNotResidentComponent;
  let fixture: ComponentFixture<CompaniesNotResidentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompaniesNotResidentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesNotResidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
