import { Injectable } from '@angular/core';
import { HostappService } from './hostapp.service';
import { Http } from '@angular/http';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EventOrderService {

  constructor(
    public hostAppService: HostappService,
    private http: Http
  ) { }

  add(order: any, eventName: string): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost()+ '/' + eventName + '/orders';

    return this.http.post(ordersApiURL , order);
  }

  show(eventName: string, id: number): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost()+ '/' + eventName  + '/orders';
    return this.http.get(ordersApiURL + "/" + id);
  }

  activeItem(eventName: string, accountId: any): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/' + eventName + '/orders';

    return this.http.get(ordersApiURL + '/active_items?account_id=' + accountId);
  }

  favouriteItems(eventName: string, accountId: number): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/' + eventName + '/orders';

    return this.http.get(ordersApiURL + '/favourite_items/'+ accountId);
  }

  currentEvent(eventName: string): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/' + eventName + '/orders';

    return this.http.get(ordersApiURL + "/event");
  }

  stations(eventName: string): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/' + eventName + '/orders';

    return this.http.get(ordersApiURL + '/stations');
  }

  accounts(eventName: string): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/' + eventName + '/orders';

    return this.http.get(ordersApiURL + '/accounts');
  }

  favourite(eventName: string, itemId: number, accountId: number): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost()+ '/' + eventName  + '/orders';
    return this.http.get(ordersApiURL + "/favourite/" + itemId + '/' + accountId);
  }

  remove_favourite(eventName: string, itemId: number, accountId: number): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost()+ '/' + eventName  + '/orders';
    return this.http.get(ordersApiURL + "/remove_favourite/" + itemId + '/' + accountId);
  }
}
