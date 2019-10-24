import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Order } from '../order';
import { Event } from '../event';
import { HeaderService } from "../services/header.service";
import { EventOrderService } from '../event_order.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-account-order-confirmed',
  templateUrl: './account-order-confirmed.component.html',
  styleUrls: ['./account-order-confirmed.component.css']
})
export class AccountOrderConfirmedComponent implements OnInit {

  public showHeader: boolean;
  public errorMessage: any;
  private eventName: string;
  public order: any;
  public currentEvent: Event = new Event();
  public isOrderPrinting: boolean = false;
  public timerSubscription: any;
  public accountNumber: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventOrderService: EventOrderService,
    private header: HeaderService
  ) {
    this.header.changeMessage(false)
  }

  ngOnInit() {
  	this.route.params.subscribe(
      (params: any) => {
        let id : number = params.id;
        this.eventName = params.event;
        this.accountNumber = params.accountNumber;
        this.loadCurrentEvent();
        this.getOrder(id);
      }
    );
  }

  private loadCurrentEvent(): void {
    this.eventOrderService.currentEvent(this.eventName).subscribe(
      successResponse => {
        this.currentEvent = successResponse.json();
        // Set Title
        document.title = this.currentEvent.published_name
      },
      () => {
        this.errorMessage = 'Failed to load Event.';
      }
    );
  }

  private getOrder(id: number): void {
    this.eventOrderService.show(this.eventName, id).subscribe(
      successResponse => {
        this.order = successResponse.json();
      },
      () => {
        this.errorMessage = 'Failed to load order.';
      }
    );
  }

  public getPrice(item){
    if(item.special_price && item.special_price != 0){
      return item.special_price
    }else{
      return item.price
    }
  }

  public currentDate(){
    return new Date();
  }
}
