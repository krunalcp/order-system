import { Injectable } from '@angular/core';
import { HostappService } from './hostapp.service';
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
// import { Item } from './item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(
  	public hostAppService: HostappService,
  	private http: Http
  ) { }

  add(item: any): Observable<any>{
    let itemsApiURL = this.hostAppService.getHost() + '/items';

    return this.http.post(itemsApiURL, item, this.hostAppService.getToken());
  }

  import(items: any): Observable<any>{
    let itemsApiURL = this.hostAppService.getHost() + '/items/import_items';

    return this.http.post(itemsApiURL, {items: items}, this.hostAppService.getToken());
  }

  show(id: number): Observable<any>{
    let itemsApiURL = this.hostAppService.getHost() + '/items';

    return this.http.get(itemsApiURL + "/" + id, this.hostAppService.getToken());
  }

  update(id: number, item:any): Observable<any>{
    let itemsApiURL = this.hostAppService.getHost() + '/items';

    return this.http.put(itemsApiURL + "/" + id, item, this.hostAppService.getToken());
  }

  remove(id: number): Observable<any>{
    let itemsApiURL = this.hostAppService.getHost() + '/items';

    return this.http.delete(itemsApiURL + "/" + id, this.hostAppService.getToken());
  }

  list(): Observable<any>{
  	let itemsApiURL = this.hostAppService.getHost() + '/items';

    return this.http.get(itemsApiURL, this.hostAppService.getToken());
  }

  activeItem(): Observable<any>{
    let itemsApiURL = this.hostAppService.getHost() + '/items/active_items';

    return this.http.get(itemsApiURL, this.hostAppService.getToken());
  }

  nonActiveItem(): Observable<any>{
    let itemsApiURL = this.hostAppService.getHost() + '/items/non_active_items';

    return this.http.get(itemsApiURL, this.hostAppService.getToken());
  }

  lastOrderNumber(): Observable<any>{
    let itemsApiURL = this.hostAppService.getHost() + '/items/last_order_number';

    return this.http.get(itemsApiURL, this.hostAppService.getToken());
  }

  listSummary(s_type: string): Observable<any>{
    let itemsApiURL = this.hostAppService.getHost() + '/items/order_summary?type=' + s_type;

    return this.http.get(itemsApiURL, this.hostAppService.getToken());
  }
}
