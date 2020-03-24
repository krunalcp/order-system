import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPriceImportComponent } from './item-price-import.component';

describe('ItemPriceImportComponent', () => {
  let component: ItemPriceImportComponent;
  let fixture: ComponentFixture<ItemPriceImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemPriceImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPriceImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
