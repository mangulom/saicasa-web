import { TestBed } from '@angular/core/testing';

import { ProcapacitacionService } from './procapacitacion.service';

describe('ProcapacitacionService', () => {
  let service: ProcapacitacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcapacitacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
