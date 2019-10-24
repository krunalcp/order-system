import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountOrderConfirmedComponent } from './account-order-confirmed.component';

describe('AccountOrderConfirmedComponent', () => {
  let component: AccountOrderConfirmedComponent;
  let fixture: ComponentFixture<AccountOrderConfirmedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountOrderConfirmedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderConfirmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
