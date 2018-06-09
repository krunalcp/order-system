import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationShowComponent } from './station-show.component';

describe('StationShowComponent', () => {
  let component: StationShowComponent;
  let fixture: ComponentFixture<StationShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
