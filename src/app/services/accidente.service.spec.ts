import { TestBed } from '@angular/core/testing';

import { AccidenteService } from './accidente.service';

describe('AccidenteService', () => {
  let service: AccidenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccidenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
