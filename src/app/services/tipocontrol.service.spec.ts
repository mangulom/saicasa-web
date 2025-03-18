import { TestBed } from '@angular/core/testing';

import { TipocontrolService } from './tipocontrol.service';

describe('TipocontrolService', () => {
  let service: TipocontrolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipocontrolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
