import { Injectable } from '@angular/core';
import {Angular2TokenService} from 'angular2-token';
import {Response} from '@angular/http';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HostappService } from '../hostapp.service';
import { Http } from '@angular/http';


@Injectable({
  providedIn: 'root'
})
export class AccountAuthService {
	accountSignedIn$: Subject<boolean> = new Subject();
  constructor(private accountAuthService: Angular2TokenService,
  	public hostAppService: HostappService,
  	private http: Http
  ) {

    // this.accountAuthService.validateToken().subscribe(
    //   res => res.status === 200 ? this.accountSignedIn$.next(res.json().success) : this.accountSignedIn$.next(false)
    // );
  }

  logOutUser(): Observable<any> {

    return this.accountAuthService.signOut().pipe(map(
        res => {
          this.accountSignedIn$.next(false);
          return res;
        })
    );
  }

  registerUser(signUpData:any): Observable<any> {
    return this.accountAuthService.registerAccount(signUpData).pipe(map(
        res => {
          this.accountSignedIn$.next(true);
          return res;
        })
    );
  }

  logInUser(signInData: any): Observable<any> {
    let eventsApiURL = this.hostAppService.getHost() + '/account/login';

    return this.http.post(eventsApiURL, signInData);
  }

  // logInUser(signInData: {email: string, password: string}): Observable<any> {
  //   return this.accountAuthService.signIn(signInData).pipe(map(
  //     res => {
  //       this.accountSignedIn$.next(true);
  //       return res;
  //     })
  //   );
  // }
}
