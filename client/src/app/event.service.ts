import { Injectable } from '@angular/core';
import { HostappService } from './hostapp.service';
import { Http } from '@angular/http';
import {Observable} from "rxjs";
// import { Item } from './item';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
  	public hostAppService: HostappService,
  	private http: Http
  ) { }

  add(event: any): Observable<any>{
    let categoriesApiURL = this.hostAppService.getHost() + '/events';

    return this.http.post(categoriesApiURL, event, this.hostAppService.getToken());
  }

  show(id: number): Observable<any>{
    let categoriesApiURL = this.hostAppService.getHost() + '/events';

    return this.http.get(categoriesApiURL + "/" + id, this.hostAppService.getToken());
  }

  update(id: number, event:any): Observable<any>{
    let categoriesApiURL = this.hostAppService.getHost() + '/events';

    return this.http.put(categoriesApiURL + "/" + id, event, this.hostAppService.getToken());
  }

  remove(id: number): Observable<any>{
    let categoriesApiURL = this.hostAppService.getHost() + '/events';

    return this.http.delete(categoriesApiURL + "/" + id, this.hostAppService.getToken());
  }

  list(): Observable<any>{
  	let categoriesApiURL = this.hostAppService.getHost() + '/events';

  	return this.http.get(categoriesApiURL, this.hostAppService.getToken());
  }
}
