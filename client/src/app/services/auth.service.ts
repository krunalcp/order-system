import { Injectable } from '@angular/core';
import {Angular2TokenService} from 'angular2-token';
import {Response} from '@angular/http';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {

  userSignedIn$: Subject<boolean> = new Subject();

  constructor(private authService: Angular2TokenService) {

    // this.authService.validateToken().subscribe(
    //   res => res.status === 200 ? this.userSignedIn$.next(res.json().success) : this.userSignedIn$.next(false)
    // );
  }

  logOutUser(): Observable<any> {

    return this.authService.signOut().pipe(map(
        res => {
          this.userSignedIn$.next(false);
          return res;
        })
    );
  }

  registerUser(signUpData:any): Observable<any> {
    return this.authService.registerAccount(signUpData).pipe(map(
        res => {
          this.userSignedIn$.next(true);
          return res;
        })
    );
  }

  logInUser(signInData: {email: string, password: string}): Observable<any> {
    this.logOutUser().subscribe();
    return this.authService.signIn(signInData).pipe(map(
      res => {
        this.userSignedIn$.next(true);
        return res;
      })
    );
  }
}
