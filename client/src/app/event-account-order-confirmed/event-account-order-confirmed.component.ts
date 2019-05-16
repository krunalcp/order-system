import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Order } from '../order';
import { Event } from '../event';
import { HeaderService } from "../services/header.service";
import { EventOrderService } from '../event_order.service';


@Component({
  selector: 'app-event-account-order-confirmed',
  templateUrl: './event-account-order-confirmed.component.html',
  styleUrls: ['./event-account-order-confirmed.component.css']
})
export class EventAccountOrderConfirmedComponent implements OnInit {
public showHeader: boolean;
  public errorMessage: any;
  private eventName: string;
  public order: any;
  public currentEvent: Event = new Event();

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

  public printOrders(order_id) {
    order_id = parseInt(order_id);
    var printSection = document.getElementById(order_id).innerHTML;
    var popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
            @media print
            {
              .text-center {
                text-align: center;
              }
              .print-hide {
                display: none;
              }
              .print-show {
                display: block;
              }
              @page {
                size: 7in 9.25in;
              }
            }
          </style>
        </head>
        <body onload="window.print();window.close()">${printSection}</body>
      </html>`
    );
    popupWin.document.close();
  }


}
