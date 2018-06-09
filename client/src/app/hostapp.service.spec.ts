import { TestBed, inject } from '@angular/core/testing';

import { HostappService } from './hostapp.service';

describe('HostappService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HostappService]
    });
  });

  it('should be created', inject([HostappService], (service: HostappService) => {
    expect(service).toBeTruthy();
  }));
});
