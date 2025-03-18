import { TestBed } from '@angular/core/testing';

import { EmoService } from './emo.service';

describe('EmoService', () => {
  let service: EmoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
