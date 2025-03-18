import { TestBed } from '@angular/core/testing';

import { CapacitacionService } from './capacitacion.service';

describe('CapacitacionService', () => {
  let service: CapacitacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CapacitacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
