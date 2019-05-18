import { Injectable } from '@angular/core';
import { HostappService } from './hostapp.service';
import { Http } from '@angular/http';
import {Observable} from "rxjs";
// import { Item } from './account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
  	public hostAppService: HostappService,
  	private http: Http
  ) { }

  add(account: any): Observable<any>{
    let categoriesApiURL = this.hostAppService.getHost() + '/accounts';

    return this.http.post(categoriesApiURL, account, this.hostAppService.getToken());
  }

  show(id: number): Observable<any>{
    let categoriesApiURL = this.hostAppService.getHost() + '/accounts';

    return this.http.get(categoriesApiURL + "/" + id, this.hostAppService.getToken());
  }

  update(id: number, account:any): Observable<any>{
    let categoriesApiURL = this.hostAppService.getHost() + '/accounts';

    return this.http.put(categoriesApiURL + "/" + id, account, this.hostAppService.getToken());
  }

  remove(id: number): Observable<any>{
    let categoriesApiURL = this.hostAppService.getHost() + '/accounts';

    return this.http.delete(categoriesApiURL + "/" + id, this.hostAppService.getToken());
  }

  list(): Observable<any>{
  	let categoriesApiURL = this.hostAppService.getHost() + '/accounts';

  	return this.http.get(categoriesApiURL, this.hostAppService.getToken());
  }

  list(active: boolean): Observable<any>{
  	let categoriesApiURL = this.hostAppService.getHost() + '/accounts';
    if(active){
      categoriesApiURL = categoriesApiURL + '?active=1';
    }

  	return this.http.get(categoriesApiURL, this.hostAppService.getToken());
  }
}
