import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import {Subscription} from 'rxjs';

import { AccountService } from '../account.service';

import { Account } from '../account';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.css'],
  providers: [AccountService]
})
export class AccountEditComponent implements OnInit {

	private accountId: number;
	public account: Account = new Account();
	public accountForm: FormGroup;
	public accountUpdateRequest: Subscription;
  private isFormSubmitted: boolean;
  public isAccountUpdating: boolean = false;

	public errorMessage: any;
  public formErrors = {
    'name': '',
    'contact_name': '',
    'phone': '',
    'email': '',
    'password': ''
  };
  validationMessages = {
    'name': {
      'required': 'Name is required.'
    },
    'email': {
      'required': 'Email is required.'
    }
  };


  constructor(
  	private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
  	private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.buildForm();

  	this.route.params.subscribe(
      (params: any) => {
        this.accountId = params.id;
        this.getAccount();
      }
    );

  }

  public onSubmit() {
    if(this.accountForm.status == 'INVALID') {
      this.isFormSubmitted = true;
      this.onValueChanged();
      return;
    }
    this.account = this.accountForm.value;
    this.isAccountUpdating = true
    this.accountUpdateRequest = this.accountService.update(this.accountId, this.account).subscribe(
      successResponse => {
        this.sucessHandler(successResponse);
        // swal({title: 'Product added successfully', type: 'success'});
      },
      errorResponse   => {
        this.errorHandler(errorResponse);
      }
    );
  }

  public cancelAccount(){
    this.router.navigate(['/account/list']);
  }

  private getAccount(): void {
    this.accountService.show(this.accountId).subscribe(
      successResponse => {
        let data = successResponse.json();
        this.account['name'] = data.name;
        this.account['contact_name'] = data.contact_name;
        this.account['phone'] = data.phone;
        this.account['email'] = data.email;
        this.account['event_id'] = data.event_id;
        this.accountForm.patchValue(this.account);
      },
      () => {
        this.errorMessage = 'Failed to load account.';
      }
    );
  }

  private buildForm(): void {
    this.accountForm = this.fb.group({
      'name': [
        this.account.name, [
          Validators.required,
          // Validators.maxLength(this.maxlength.title)
        ]
      ],
      'contact_name': [
        this.account.contact_name
      ],
      'phone': [
        this.account.phone
      ],
      'email': [
        this.account.email, [
          Validators.required,
        ]
      ],
      'password': [
        ''
      ]
    });

    this.accountForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  private onValueChanged(data?: any) {
    if (!this.accountForm) { return; }
    const form = this.accountForm;

    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && (this.isFormSubmitted || control.dirty) && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          if(this.formErrors[field].length == 0) {
            this.formErrors[field] += messages[key];
          } else {
            break;
          }
        }
      }
    }
  }

  private sucessHandler(successResponse: Response): void {
    // this.account = successResponse.json();
    // this.isAccountCreated = true;
    this.isAccountUpdating = false;
    this.router.navigate(['/account/list']);
  }

  private errorHandler(errorResponse: Response): void {
    this.isAccountUpdating = false;
    let data = errorResponse.json();

    if(data.errors.length > 0) {
      this.formErrors.name = data.errors.join(', ')
    }
  }

}
