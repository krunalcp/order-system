import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionNotesComponent } from './production-notes.component';

describe('ProductionNotesComponent', () => {
  let component: ProductionNotesComponent;
  let fixture: ComponentFixture<ProductionNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
