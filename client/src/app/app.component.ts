import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HostappService } from './hostapp.service';
import {Angular2TokenService} from "angular2-token";
import { Http } from '@angular/http';
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HostappService]
})
export class AppComponent {
  title = 'app';

  constructor(
    public hostAppService: HostappService,
    public router: Router,
    public route: ActivatedRoute,
    public tokenService: Angular2TokenService,
    private http: Http
  ){
    this.tokenService.init({apiBase: this.dispHost()});
  }

  public dispHost(){
  	return this.hostAppService.getHost();
  }

  public onSignout(){
    let eventsApiURL = this.hostAppService.getHost() + '/auth/sign_out';

  	this.http.delete(eventsApiURL, this.hostAppService.getToken()).subscribe(
      successResponse => {
        console.log('sign out')
      }
    );
    this.tokenService.signOut().subscribe();
    this.router.navigate(['/login']);
  }
}
