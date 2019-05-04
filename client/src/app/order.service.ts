import { Injectable } from '@angular/core';
import { HostappService } from './hostapp.service';
import { Http } from '@angular/http';
import { Observable } from "rxjs";

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

    return this.http.post(ordersApiURL, order, this.hostAppService.getToken());
  }

  import(orders: any): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/orders/import_orders';

    return this.http.post(ordersApiURL, {orders: orders}, this.hostAppService.getToken());
  }

  show(id: number): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/orders';

    return this.http.get(ordersApiURL + "/" + id, this.hostAppService.getToken());
  }

  update(id: number, order:any): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/orders';

    return this.http.put(ordersApiURL + "/" + id, order, this.hostAppService.getToken());
  }

  remove(id: number): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/orders';

    return this.http.delete(ordersApiURL + "/" + id, this.hostAppService.getToken());
  }

  list(page: number, stationId: number, onlyOrder: number, sortBy: string, sortOrder: string): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/orders';
    ordersApiURL = ordersApiURL + '?s=' + stationId + '&page=' + page + '&oo=' + onlyOrder;
    if (stationId != 0) {
      ordersApiURL = ordersApiURL + '&per=20'
    }
    if (sortBy && sortBy != ''){
      ordersApiURL += '&sort_by=' + sortBy;
    }
    if (sortOrder && sortOrder != ''){
      ordersApiURL += '&sort_order=' + sortOrder;
    }

    return this.http.get(ordersApiURL, this.hostAppService.getToken());
  }

  listAll(): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/orders?all=true;';

    return this.http.get(ordersApiURL, this.hostAppService.getToken());
  }

  stationList(): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/orders';

    return this.http.get(ordersApiURL + "/" + "pending_list", this.hostAppService.getToken());
  }

  stations(): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/stations';

    return this.http.get(ordersApiURL + "/" , this.hostAppService.getToken());
  }

  event_stations(eventId: number): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/stations?e='+eventId;

    return this.http.get(ordersApiURL , this.hostAppService.getToken());
  }

  markFulfilled(id: number): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/orders';

    return this.http.put(ordersApiURL + "/" + id + "/mark_fulfilled", {}, this.hostAppService.getToken());
  }

  markItemFulfilled(id: number, categoryId: number): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/orders';

    return this.http.put(ordersApiURL + "/" + id + "/mark_item_fulfilled?c="+categoryId, {}, this.hostAppService.getToken());
  }

  lastOrderNumber(): Observable<any>{
    let ordersApiURL = this.hostAppService.getHost() + '/orders/last_order_number';

    return this.http.get(ordersApiURL, this.hostAppService.getToken());
  }
}
