import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemImportComponent } from './item-import.component';

describe('ItemImportComponent', () => {
  let component: ItemImportComponent;
  let fixture: ComponentFixture<ItemImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
