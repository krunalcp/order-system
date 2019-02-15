import { Injectable } from '@angular/core';
import { HostappService } from './hostapp.service';
import { Http } from '@angular/http';
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

    return this.http.post(itemsApiURL, item);
  }

  show(id: number): Observable<any>{
    let itemsApiURL = this.hostAppService.getHost() + '/items';

    return this.http.get(itemsApiURL + "/" + id);
  }

  update(id: number, item:any): Observable<any>{
    let itemsApiURL = this.hostAppService.getHost() + '/items';

    return this.http.put(itemsApiURL + "/" + id, item);
  }

  remove(id: number): Observable<any>{
    let itemsApiURL = this.hostAppService.getHost() + '/items';

    return this.http.delete(itemsApiURL + "/" + id);
  }

  list(): Observable<any>{
  	let itemsApiURL = this.hostAppService.getHost() + '/items';

  	return this.http.get(itemsApiURL);
  }

  activeItem(): Observable<any>{
    let itemsApiURL = this.hostAppService.getHost() + '/items/active_items';

    return this.http.get(itemsApiURL);
  }

  lastOrderNumber(): Observable<any>{
    let itemsApiURL = this.hostAppService.getHost() + '/items/last_order_number';

    return this.http.get(itemsApiURL);
  }

  listSummary(s_type: string): Observable<any>{
    let itemsApiURL = this.hostAppService.getHost() + '/items/order_summary?type=' + s_type;

    return this.http.get(itemsApiURL);
  }
}
