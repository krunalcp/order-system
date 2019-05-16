import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventAccountOrderConfirmedComponent } from './event-account-order-confirmed.component';

describe('EventAccountOrderConfirmedComponent', () => {
  let component: EventAccountOrderConfirmedComponent;
  let fixture: ComponentFixture<EventAccountOrderConfirmedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventAccountOrderConfirmedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventAccountOrderConfirmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
