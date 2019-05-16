import { TestBed, inject } from '@angular/core/testing';

import { AccountAuthService } from './account-auth.service';

describe('AccountAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountAuthService]
    });
  });

  it('should be created', inject([AccountAuthService], (service: AccountAuthService) => {
    expect(service).toBeTruthy();
  }));
});
