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

  add(item: any): Observable<any>{
    let categoriesApiURL = this.hostAppService.getHost() + '/events';

    return this.http.post(categoriesApiURL, item);
  }

  show(id: number): Observable<any>{
    let categoriesApiURL = this.hostAppService.getHost() + '/events';

    return this.http.get(categoriesApiURL + "/" + id);
  }

  update(id: number, item:any): Observable<any>{
    let categoriesApiURL = this.hostAppService.getHost() + '/events';

    return this.http.put(categoriesApiURL + "/" + id, item);
  }

  remove(id: number): Observable<any>{
    let categoriesApiURL = this.hostAppService.getHost() + '/events';

    return this.http.delete(categoriesApiURL + "/" + id);
  }

  list(): Observable<any>{
  	let categoriesApiURL = this.hostAppService.getHost() + '/events';

  	return this.http.get(categoriesApiURL);
  }
}
