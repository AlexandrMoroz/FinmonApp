import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleFopComponent } from './people-fop.component';

describe('PeopleFopComponent', () => {
  let component: PeopleFopComponent;
  let fixture: ComponentFixture<PeopleFopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleFopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleFopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
