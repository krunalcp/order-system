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
  }
}
