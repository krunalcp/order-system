import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { AccountService } from '../account.service';

import { Account } from '../account';

@Component({
  selector: 'app-account-add',
  templateUrl: './account-add.component.html',
  styleUrls: ['./account-add.component.css'],
  providers: [AccountService]
})
export class AccountAddComponent implements OnInit {

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
      'required': 'Name is required.',
    },
    'email': {
      'required': 'Email is required.',
    },
    'password': {
      'required': 'Password is required.',
    }
  };

	public accountForm: FormGroup;
	public account : Account = new Account();
	public accountAddRequest: Subscription;
  private isFormSubmitted: boolean;
  public isAccountAdding: boolean = false;

  constructor(
  	private accountService: AccountService,
  	private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  public onSubmit() {
    if(this.accountForm.status == 'INVALID') {
      this.isFormSubmitted = true;
      this.onValueChanged();
      return;
    }
    this.account = this.accountForm.value;
    this.isAccountAdding = true;
    this.accountAddRequest = this.accountService.add(this.account).subscribe(
      successResponse => {
        this.sucessHandler(successResponse);
        // swal({title: 'Product added successfully', type: 'success'});
      },
      errorResponse => {
        this.errorHandler(errorResponse);
      }
    );
  }

  public cancelAccount(){
    this.router.navigate(['/account/list']);
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
          Validators.required
        ]
      ],
      'password': [
        '', [
          Validators.required
        ]
      ]
    });

    this.accountForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

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
    // this.isItemCreated = true;
    this.isAccountAdding = false;
    this.router.navigate(['/account/list']);
  }

  private errorHandler(errorResponse: Response): void {
    this.isAccountAdding = false;
    let data = errorResponse.json();

    if(data.errors.length > 0) {
      this.formErrors.name = data.errors.join(', ')
    }
  }
}
