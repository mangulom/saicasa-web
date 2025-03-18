import { TestBed } from '@angular/core/testing';

import { CostoService } from './costo.service';

describe('CostoService', () => {
  let service: CostoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CostoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
