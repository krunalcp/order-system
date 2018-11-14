import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HostappService {

  constructor() { }

  public getHost(){
    const environment: any = window.location.hostname;

    if (environment == 'localhost'){
      return "http://localhost:3000"
    }
    else if (environment == 'foodup-demo.herokuapp.com'){
      return "https://foodup-demo.herokuapp.com"
    }
    else if (environment == 'ctordering.herokuapp.com'){
      return "https://ctordering.herokuapp.com"
    }
    else if (environment == 'ctordering-test.herokuapp.com'){
      return "https://ctordering-test.herokuapp.com"
    }
  }
}
