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
    let eventsApiURL = this.hostAppService.getHost() + '/events';

    return this.http.post(eventsApiURL, event, this.hostAppService.getToken());
  }

  show(id: number): Observable<any>{
    let eventsApiURL = this.hostAppService.getHost() + '/events';

    return this.http.get(eventsApiURL + "/" + id, this.hostAppService.getToken());
  }

  current(): Observable<any>{
    let eventsApiURL = this.hostAppService.getHost() + '/events';

    return this.http.get(eventsApiURL + "/current", this.hostAppService.getToken());
  }

  update(id: number, event:any): Observable<any>{
    let eventsApiURL = this.hostAppService.getHost() + '/events';

    return this.http.put(eventsApiURL + "/" + id, event, this.hostAppService.getToken());
  }

  remove(id: number): Observable<any>{
    let eventsApiURL = this.hostAppService.getHost() + '/events';

    return this.http.delete(eventsApiURL + "/" + id, this.hostAppService.getToken());
  }

  list(): Observable<any>{
  	let eventsApiURL = this.hostAppService.getHost() + '/events';

  	return this.http.get(eventsApiURL, this.hostAppService.getToken());
  }
}
