import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import { EventAuthService } from '../services/event-auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { first } from 'rxjs/operators';
import { HeaderService } from "../services/header.service";
import { EventOrderService } from '../event_order.service';
import { Event } from '../event';

@Component({
  selector: 'app-event-login-form',
  templateUrl: './event-login-form.component.html',
  styleUrls: ['./event-login-form.component.css'],
  providers: [
    EventOrderService
  ]
})
export class EventLoginFormComponent implements OnInit {

  public name: string;
  public password: string;

  public errors: any;
  public currentEvent: Event = new Event();
  public eventName: string;

  @Output() onFormResult = new EventEmitter<any>();

  constructor(
    public authService: EventAuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private header: HeaderService,
    private eventOrderService: EventOrderService,
    private route: ActivatedRoute,
  ) {
    this.header.changeMessage(false)
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: any) => {
        this.eventName = params.event;
        this.loadCurrentEvent();
      }
    );

  }

  private loadCurrentEvent(): void {
    this.eventOrderService.currentEvent(this.eventName).subscribe(
      successResponse => {
        this.currentEvent = successResponse.json();
        this.navigateToOrder();
      },
      () => {}
    );
  }

  public navigateToOrder(){
    console.log(this.currentEvent);
    if(!this.currentEvent.require_password_for_customer_order){
      this.router.navigate([this.currentEvent.name + '/order'])
      console.log(1);
    }
  }

  public setCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  onSignInSubmit() {
    this.authService.login(this.name, this.password, this.eventName)
      .pipe(first())
      .subscribe(
        result => {
          var body = JSON.parse(result._body)
          localStorage.setItem('event_access_token', body.token);
          this.setCookie('ct_account_id', body.account_id);
          this.router.navigate([body.event_name + '/order'])
        },
        err => {
          console.log('err:', err);
          this.errors = JSON.parse(err._body).message;
          this.flashMessage.show(this.errors, { cssClass: 'alert-danger', timeout: 2000 });
        }
      );
  }
}
