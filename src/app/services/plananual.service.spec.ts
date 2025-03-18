import { TestBed } from '@angular/core/testing';

import { PlananualService } from './plananual.service';

describe('PlananualService', () => {
  let service: PlananualService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlananualService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
