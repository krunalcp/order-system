import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {AuthService} from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgFlashMessageService } from 'ng-flash-messages';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  signInUser = {
    email: '',
    password: ''
  };

  public errors: any;
  @Output() onFormResult = new EventEmitter<any>();

  constructor(
    public authService: AuthService,
    private router: Router,
    private ngFlashMessageService: NgFlashMessageService
  ) {}

  ngOnInit() {}

  onSignInSubmit() {

    this.authService.logInUser(this.signInUser).subscribe(
        res => {
          if (res.status === 200) {
            this.onFormResult.emit({signedIn: true, res});
            window.location.href = '/';
          }
        },
        err => {
          console.log('err:', err);
          this.errors = JSON.parse(err._body).errors;
          this.ngFlashMessageService.showFlashMessage({
            messages: this.errors,
            dismissible: false,
            timeout: 2000,
            type: 'danger'
          });
          this.onFormResult.emit({signedIn: false, err});
        }
    );

  }

}
