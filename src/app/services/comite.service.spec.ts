import { TestBed } from '@angular/core/testing';

import { ComiteService } from './comite.service';

describe('ComiteService', () => {
  let service: ComiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
