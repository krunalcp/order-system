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
  listSummary(): Observable<any>{
    let itemsApiURL = this.hostAppService.getHost() + '/items/order_summary' ;

    return this.http.get(itemsApiURL);
  }
}
