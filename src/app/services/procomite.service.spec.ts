import { TestBed } from '@angular/core/testing';

import { ProcomiteService } from './procomite.service';

describe('ProcomiteService', () => {
  let service: ProcomiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcomiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
