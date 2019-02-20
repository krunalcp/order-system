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
      return "http://localhost:3002"
    }
    else if (environment == 'ctordering.herokuapp.com'){
      return "https://ctordering.herokuapp.com"
    }
    else if (environment == 'ctordering-test.herokuapp.com'){
      return "https://ctordering-test.herokuapp.com"
    }
    else if (environment == 'ctordering-obsolete.herokuapp.com'){
      return "https://ctordering-obsolete.herokuapp.com"
    }
    else if (environment == 'ctordering-demo.herokuapp.com'){
      return "https://ctordering-demo.herokuapp.com"
    }
  }

  public isTestSite() {
    const environment: any = window.location.hostname;

    if (environment == 'ctordering.herokuapp.com'){
      return false
    }
    else{
      return true
    }
  }

  public getToken(){
    let headers = new Headers({
      'access-token': this.tokenService.currentAuthData.accessToken,
      'client': this.tokenService.currentAuthData.client,
      'uid': this.tokenService.currentAuthData.uid,
      'expiry': this.tokenService.currentAuthData.expiry,
      'token_type': this.tokenService.currentAuthData.tokenType
    });
    return new RequestOptions({headers: headers});
  }
}
