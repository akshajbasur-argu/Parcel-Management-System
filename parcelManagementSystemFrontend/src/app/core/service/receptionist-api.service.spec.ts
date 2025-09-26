import { TestBed } from '@angular/core/testing';

import { ReceptionistApiService } from './receptionist-api.service';

describe('ReceptionistApiService', () => {
  let service: ReceptionistApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceptionistApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
