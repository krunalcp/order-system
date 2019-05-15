import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {AuthService} from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

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

  constructor(public authService: AuthService, private router: Router) {}

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
          this.onFormResult.emit({signedIn: false, err});
        }
    );

  }

}
