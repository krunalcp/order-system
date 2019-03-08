import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventOrderListComponent } from './event-order-list.component';

describe('EventOrderListComponent', () => {
  let component: EventOrderListComponent;
  let fixture: ComponentFixture<EventOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventOrderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
