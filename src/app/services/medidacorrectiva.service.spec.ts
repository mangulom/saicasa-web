import { TestBed } from '@angular/core/testing';

import { MedidacorrectivaService } from './medidacorrectiva.service';

describe('MedidacorrectivaService', () => {
  let service: MedidacorrectivaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedidacorrectivaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
