import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HostappService } from './hostapp.service';
import {Angular2TokenService} from "angular2-token";

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
    public tokenService: Angular2TokenService
  ){
    this.tokenService.init({apiBase: this.dispHost()});
  }

  public dispHost(){
  	return this.hostAppService.getHost();
  }

  public onSignout(){
    this.tokenService.signOut();
    this.router.navigate(['/login'])
  }
}
