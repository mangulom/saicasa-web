import { TestBed } from '@angular/core/testing';

import { ProgramdeteppsService } from './programdetepps.service';

describe('ProgramdeteppsService', () => {
  let service: ProgramdeteppsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgramdeteppsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
