import { TestBed } from '@angular/core/testing';

import { PeopleFopService } from './people-fop.service';

describe('PeopleFopService', () => {
  let service: PeopleFopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeopleFopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
