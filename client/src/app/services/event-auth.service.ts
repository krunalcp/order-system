import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HostappService } from '../hostapp.service';

@Injectable()
export class EventAuthService {
  constructor(private http: Http, public hostAppService: HostappService,) { }

  login(name: string, password: string, eventName: string): Observable<any> {
    return this.http.post(this.hostAppService.getHost()+'/account/login', {name: name, password: password, event: eventName})
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  logout() {
    localStorage.removeItem('event_access_token');
  }

  public get loggedIn(): boolean {
    return (localStorage.getItem('event_access_token') !== null);
  }
}
