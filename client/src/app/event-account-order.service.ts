import { Injectable } from '@angular/core';
import { HostappService } from './hostapp.service';
import { Http } from '@angular/http';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EventAccountOrderService {

  constructor(
    public hostAppService: HostappService,
    private http: Http
  ) { }
 
  add(order: any, eventName: string, accountName: string): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost()+ '/' + eventName + '/account/orders';

    return this.http.post(ordersApiURL , order);
  }

  show(eventName: string, accountName: string, id: number): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost()+ '/' + eventName  + '/account/orders';
    return this.http.get(ordersApiURL + "/" + id);
  }

  activeItem(eventName: string, accountName: string, accountId: any): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/' + eventName + '/account/orders';

    return this.http.get(ordersApiURL + '/active_items?account_id=' + accountId);
  }

  favouriteItems(eventName: string, accountName: string, accountId: number): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/' + eventName + '/account/orders';

    return this.http.get(ordersApiURL + '/favourite_items/'+ accountId);
  }

  currentEvent(eventName: string, accountName: string): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/' + eventName + '/account/orders';

    return this.http.get(ordersApiURL + "/event");
  }

  stations(eventName: string, accountName: string): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/' + eventName + '/account/orders';

    return this.http.get(ordersApiURL + '/stations');
  }

  accounts(eventName: string, accountName: string): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/' + eventName + '/account/orders';

    return this.http.get(ordersApiURL + '/accounts');
  }

  favourite(eventName: string, accountName: string, itemId: number, accountId: number): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost()+ '/' + eventName  + '/account/orders';
    return this.http.get(ordersApiURL + "/favourite/" + itemId + '/' + accountId);
  }

  remove_favourite(eventName: string, accountName: string, itemId: number, accountId: number): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost()+ '/' + eventName  + '/account/orders';
    return this.http.get(ordersApiURL + "/remove_favourite/" + itemId + '/' + accountId);
  }

  saveDefaultQuantity(eventName: string, accountName: string, itemId: number, accountId: number, quantity: number): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost()+ '/' + eventName  + '/account/orders';
    return this.http.get(ordersApiURL + "/change_default_quantity/" + itemId + '/' + accountId + '?quantity=' + quantity);
  }

}
