import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationOrdersComponent } from './station-orders.component';

describe('StationOrdersComponent', () => {
  let component: StationOrdersComponent;
  let fixture: ComponentFixture<StationOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
