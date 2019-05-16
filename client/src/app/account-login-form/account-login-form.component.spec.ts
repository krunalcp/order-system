import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountLoginFormComponent } from './account-login-form.component';

describe('AccountLoginFormComponent', () => {
  let component: AccountLoginFormComponent;
  let fixture: ComponentFixture<AccountLoginFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountLoginFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountLoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
