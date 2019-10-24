import { Injectable } from '@angular/core';
import { HostappService } from './hostapp.service';
import { Http } from '@angular/http';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AccountOrderService {

  constructor(
    public hostAppService: HostappService,
    private http: Http
  ) { }

  login(eventName: string, accountNumber: any): Observable<any>{
    let accountLoginApiURL = this.hostAppService.getHost()+ '/' + eventName  + '/self_service';

    return this.http.post(accountLoginApiURL + '/login', accountNumber);
  }

  add(order: any, eventName: string, accountNumber: string): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost()+ '/' + eventName  + '/self_service';

    return this.http.post(ordersApiURL + '?number=' + accountNumber, order);
  }

  show(eventName: string, id: number): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost()+ '/' + eventName  + '/orders';
    return this.http.get(ordersApiURL + "/" + id);
  }

  activeItem(accountNumber: any): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/account_orders';

    return this.http.get(ordersApiURL + '/active_items?number=' + accountNumber);
  }

  currentEvent(accountNumber: string): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/account_orders';
    return this.http.get(ordersApiURL + "/event?number="+accountNumber);
  }
}
