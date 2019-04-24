import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventOrderConfirmedComponent } from './event-order-confirmed.component';

describe('EventOrderConfirmedComponent', () => {
  let component: EventOrderConfirmedComponent;
  let fixture: ComponentFixture<EventOrderConfirmedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventOrderConfirmedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventOrderConfirmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
