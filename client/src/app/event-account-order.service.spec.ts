import { TestBed, inject } from '@angular/core/testing';

import { EventAccountOrderService } from './event-account-order.service';

describe('EventAccountOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventAccountOrderService]
    });
  });

  it('should be created', inject([EventAccountOrderService], (service: EventAccountOrderService) => {
    expect(service).toBeTruthy();
  }));
});
