import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HostappService } from './hostapp.service';
import {Angular2TokenService} from "angular2-token";
import { Http } from '@angular/http';
import {Observable} from "rxjs";

import { EventService } from './event.service';
import { Event } from './event';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    EventService,
    HostappService
  ]
})
export class AppComponent {
  title = 'app';
  public currentEvent: Event = new Event();
	public errorMessage: any;


  constructor(
    public eventService: EventService,
    public hostAppService: HostappService,
    public router: Router,
    public route: ActivatedRoute,
    public tokenService: Angular2TokenService,
    private http: Http
  ){
    this.tokenService.init({apiBase: this.dispHost()});
  }

  ngOnInit() {
    this.loadCurrentEvent();
  }

  private loadCurrentEvent(): void {
    this.eventService.current().subscribe(
      successResponse => {
        this.currentEvent = successResponse.json();
        document.title = this.currentEvent.published_name
      },
      () => {
        this.errorMessage = 'Failed to load Event.';
      }
    );
  }

  public dispHost(){
  	return this.hostAppService.getHost();
  }

  public onSignout(){
    this.tokenService.signOut().subscribe();
    this.router.navigate(['/login']);
  }
}
