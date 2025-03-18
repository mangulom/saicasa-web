import { TestBed } from '@angular/core/testing';

import { ProvacunacionService } from './provacunacion.service';

describe('ProvacunacionService', () => {
  let service: ProvacunacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProvacunacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
