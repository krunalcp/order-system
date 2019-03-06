import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventOrderAddComponent } from './event-order-add.component';

describe('EventOrderAddComponent', () => {
  let component: EventOrderAddComponent;
  let fixture: ComponentFixture<EventOrderAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventOrderAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventOrderAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
