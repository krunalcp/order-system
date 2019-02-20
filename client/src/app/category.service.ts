import { Injectable } from '@angular/core';
import { HostappService } from './hostapp.service';
import { Http } from '@angular/http';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
  	public hostAppService: HostappService,
  	private http: Http
  ) { }

  add(category: any): Observable<any>{
    let categoriesApiURL = this.hostAppService.getHost() + '/categories';

    return this.http.post(categoriesApiURL, category, this.hostAppService.getToken());
  }

  show(id: number): Observable<any>{
    let categoriesApiURL = this.hostAppService.getHost() + '/categories';

    return this.http.get(categoriesApiURL + "/" + id, this.hostAppService.getToken());
  }

  update(id: number, category:any): Observable<any>{
    let categoriesApiURL = this.hostAppService.getHost() + '/categories';

    return this.http.put(categoriesApiURL + "/" + id, category, this.hostAppService.getToken());
  }

  remove(id: number): Observable<any>{
    let categoriesApiURL = this.hostAppService.getHost() + '/categories';

    return this.http.delete(categoriesApiURL + "/" + id, this.hostAppService.getToken());
  }

  list(): Observable<any>{
  	let categoriesApiURL = this.hostAppService.getHost() + '/categories';

  	return this.http.get(categoriesApiURL, this.hostAppService.getToken());
  }
}
