import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountOrderAddComponent } from './event-order-add.component';

describe('AccountOrderAddComponent', () => {
  let component: AccountOrderAddComponent;
  let fixture: ComponentFixture<AccountOrderAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountOrderAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
