import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventAccountOrderListComponent } from './event-account-order-list.component';

describe('EventAccountOrderListComponent', () => {
  let component: EventAccountOrderListComponent;
  let fixture: ComponentFixture<EventAccountOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventAccountOrderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventAccountOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
