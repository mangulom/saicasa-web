import { TestBed } from '@angular/core/testing';

import { EppsService } from './epps.service';

describe('EppsService', () => {
  let service: EppsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EppsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
