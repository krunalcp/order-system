import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { timer } from 'rxjs';

import { Event } from '../event';
import { EventService } from '../event.service';

declare var $: any;

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css'],
  providers: [ItemService, EventService]
})
export class OrderSummaryComponent implements OnInit {

  public orderSummary: any;
  public stations: any;
  public isItemsLoading: boolean = false;
  public timerSubscription: any;
  public s_type: string = 'quantity';
  public currentEvent: Event = new Event();
  public summary: any;

  constructor(
    private itemService: ItemService,
    public eventService: EventService
  ) { }

  ngOnInit() {
    this.loadOrderSumary();
    this.loadItemList(true, 'quantity');
    this.loadCurrentEvent();
  }

  private loadCurrentEvent(): void {
    this.eventService.current().subscribe(
      successResponse => {
        this.currentEvent = successResponse.json();
      },
      () => {}
    );
  }

  public loadItemListFromPeriod(){
    this.loadItemList(true, this.s_type)
    this.loadOrderSumary();
  }

  public loadItemList(ts: boolean, type: string){
    this.isItemsLoading = true;
    if (ts) {
      this.s_type = type;
    }
    let period = $("#period").val();
    this.itemService.listSummary(this.s_type, period).subscribe(
      successResponse => {
        this.orderSummary = successResponse.json();
        this.stations = this.orderSummary[0].stations
        this.isItemsLoading = false;
        // if(ts){
        //   this.subscribeToData();
        // }
      },
      (errorResponse) => {
        // this.displayErrors(errorResponse);
      }
    );
  }

  public loadOrderSumary(){
    let period = $("#period").val();
    this.itemService.totalSalesProfit(period).subscribe(
      successResponse => {
        this.summary = successResponse.json();
      }
    )
  }

  public subscribeToData(): void {
    this.timerSubscription = timer(60000).subscribe(() => this.loadItemList(false, this.s_type));
  }

  public refreshPage(){
    this.loadItemList(false, 'quantity')
    this.loadOrderSumary()
  }

}
