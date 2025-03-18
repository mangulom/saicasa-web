import { TestBed } from '@angular/core/testing';

import { ProemoService } from './proemo.service';

describe('ProemoService', () => {
  let service: ProemoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProemoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
