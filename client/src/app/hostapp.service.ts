import { Injectable } from '@angular/core';
import {Headers, Http, RequestOptions} from "@angular/http";
import { Angular2TokenService } from 'angular2-token';

@Injectable({
  providedIn: 'root'
})
export class HostappService {

  constructor(public tokenService: Angular2TokenService) { }

  public getHost(){
    const environment: any = window.location.hostname;

    if (environment == 'localhost'){
      return "http://localhost:3000"
    }
    else {
      return "https://" + environment
    }
  }

  public isTestSite() {
    const environment: any = window.location.hostname;

    if (environment == 'ctordering.herokuapp.com' ||
        environment == 'ctordering-obsolete.herokuapp.com'){
      return false
    }
    else{
      return true
    }
  }

  public getHeaderName(){
    const environment: any = window.location.hostname;

     if (environment == 'ctordering-obsolete.herokuapp.com'){
       return 'Obsolete Site'
     }
     else if (environment == 'ctordering-demo.herokuapp.com'){
       return 'Demo Site'
     }
     else{
      return 'TEST SITE'
    }
  }


  public getToken(){
    let headers = new Headers({
      'access-token': this.tokenService.currentAuthData.accessToken,
      'client': this.tokenService.currentAuthData.client,
      'uid': this.tokenService.currentAuthData.uid,
      'expiry': this.tokenService.currentAuthData.expiry,
      'token-type': this.tokenService.currentAuthData.tokenType
    });
    return new RequestOptions({headers: headers});
  }
}
