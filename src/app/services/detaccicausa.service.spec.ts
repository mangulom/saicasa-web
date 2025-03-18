import { TestBed } from '@angular/core/testing';

import { DetaccicausaService } from './detaccicausa.service';

describe('DetaccicausaService', () => {
  let service: DetaccicausaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetaccicausaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
