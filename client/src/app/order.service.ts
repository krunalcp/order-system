import { Injectable } from '@angular/core';
import { HostappService } from './hostapp.service';
import { Http } from '@angular/http';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
  	public hostAppService: HostappService,
  	private http: Http
  ) { }

  add(order: any): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/orders';

    return this.http.post(ordersApiURL, order);
  }

  show(id: number): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/orders';

    return this.http.get(ordersApiURL + "/" + id);
  }

  update(id: number, order:any): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/orders';

    return this.http.put(ordersApiURL + "/" + id, order);
  }

  remove(id: number): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/orders';

    return this.http.delete(ordersApiURL + "/" + id);
  }

  list(): Observable<any>{
  	let ordersApiURL = this.hostAppService.getHost() + '/orders';

  	return this.http.get(ordersApiURL);
  }

  stationList(): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/orders';

    return this.http.get(ordersApiURL + "/" + "pending_list");
  }

  stations(): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/stations';

    return this.http.get(ordersApiURL + "/" );
  }

  markFulfilled(id: number): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/orders';

    return this.http.put(ordersApiURL + "/" + id + "/mark_fulfilled", {});
  }
}
