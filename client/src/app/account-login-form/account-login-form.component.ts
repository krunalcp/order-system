import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AccountAuthService } from '../services/account-auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-account-login-form',
  templateUrl: './account-login-form.component.html',
  styleUrls: ['./account-login-form.component.css']
})
export class AccountLoginFormComponent implements OnInit {

  signInAccountUser = {
    email: '',
    password: ''
  };

  public errors: any;
  @Output() onFormResult = new EventEmitter<any>();

  constructor(
    public accountAuthService: AccountAuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) {}

  ngOnInit() {}

  onSignInSubmit() {
    this.accountAuthService.logInUser(this.signInAccountUser).subscribe(
        res => {
          if (res.status === 200) {
            this.onFormResult.emit({signedIn: true, res});
            window.location.href =  JSON.parse(res._body).account_event_name + '/account/order';
          }
        },
        err => {
          console.log('err:', err);
          this.errors = JSON.parse(err._body).errors;
          this.flashMessage.show(this.errors, { cssClass: 'alert-danger', timeout: 2000 });
          this.onFormResult.emit({signedIn: false, err});
        }
    );
  }

}
