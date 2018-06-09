import { Injectable } from '@angular/core';
import { HostappService } from './hostapp.service';
import { Http } from '@angular/http';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StationService {

  constructor(
    public hostAppService: HostappService,
    private http: Http
  ) { }

  add(station: any): Observable<any>{
    let stationsApiURL = this.hostAppService.getHost() + '/stations';

    return this.http.post(stationsApiURL, station);
  }

  show(id: number): Observable<any>{
    let stationsApiURL = this.hostAppService.getHost() + '/stations';

    return this.http.get(stationsApiURL + "/" + id);
  }

  update(id: number, station:any): Observable<any>{
    let stationsApiURL = this.hostAppService.getHost() + '/stations';

    return this.http.put(stationsApiURL + "/" + id, station);
  }

  remove(id: number): Observable<any>{
    let stationsApiURL = this.hostAppService.getHost() + '/stations';

    return this.http.delete(stationsApiURL + "/" + id);
  }

  list(): Observable<any>{
    let stationsApiURL = this.hostAppService.getHost() + '/stations';

    return this.http.get(stationsApiURL);
  }
}
