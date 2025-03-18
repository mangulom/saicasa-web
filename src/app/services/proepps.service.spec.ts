import { TestBed } from '@angular/core/testing';

import { ProeppsService } from './proepps.service';

describe('ProeppsService', () => {
  let service: ProeppsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProeppsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
