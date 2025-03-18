import { TestBed } from '@angular/core/testing';

import { MaearchivoService } from './maearchivo.service';

describe('MaearchivoService', () => {
  let service: MaearchivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaearchivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
