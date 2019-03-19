import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { timer } from 'rxjs';

import { OrderService } from '../order.service';
import { StationService } from '../station.service';
import { CategoryService } from '../category.service';
import { EventService } from '../event.service';

import { Event } from '../event';
import { Order } from '../order';

declare var $: any;

@Component({
  selector: 'app-station-orders',
  templateUrl: './station-orders.component.html',
  styleUrls: ['./station-orders.component.css'],
  providers: [
    OrderService,
    StationService,
    CategoryService,
    EventService
  ]
})
export class StationOrdersComponent implements OnInit {

  public orders: any;
  public stations: any;
  public categories: any;
  public isOrdersLoading: boolean = false;
  public isOrderChecking: boolean = false;
  public currentOrderId: number;
  public currentStation: any;
  public currentCategory: any;
  public stationOrders: any;
  public lastStation: any;
  public selectedStation: any;
  public timerSubscription: any;
  public station: any;
  public category: any;
  public refreshTime: number;
  public currentPage: number = 1;
  public totalOrder: number = 0;
  public perPageOrder: number = 0;
  public pages: number = 0;
  public selectedPage: number = 1;
  public sortBy: string = 'created_at';
  public sortOrder: string = 'desc';
  public newOrder: boolean;
  public newOrderNumbr: number;
  public categorySelected: boolean;
  public currentEvent: Event = new Event();
  public errorMessage: any;

  constructor(
  	private orderService: OrderService,
    private stationService: StationService,
    private categoryService: CategoryService,
    private router: Router,
    public eventService: EventService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadCurrentEvent()
    this.loadStationList();
    this.loadCategoryList();
  }

  private loadCurrentEvent(): void {
    this.eventService.current().subscribe(
      successResponse => {
        this.currentEvent = successResponse.json();
      },
      () => {
        this.errorMessage = 'Failed to load Event.';
      }
    );
  }

  public loadStationList(){
    // this.isStationsLoading = true;
    this.stationService.list().subscribe(
      successResponse => {
        this.stations = successResponse.json();
        this.selectedStation = this.stations[0];
        this.currentStation = this.stations[0].id;
        let last = this.stations.length;
        this.lastStation = this.stations.find(x => x.next_station_id === null).id
        this.loadOrders(true);
        // this.subscribeToStations();
      },
      (errorResponse) => {
        // this.displayErrors(errorResponse);
      }
    );
  }

  public loadCategoryList(){
    this.categoryService.list().subscribe(
      successResponse => {
        this.categories = successResponse.json();
        this.categorySelected = false
        this.currentCategory = 0
      },
      (errorResponse) => {
        // this.displayErrors(errorResponse);
      }
    );
  }

  public onCategorySelect(categoryId) {
    let sid = parseInt(categoryId);
    this.categorySelected = sid != 0;
    this.currentCategory = categoryId;
    this.currentPage = 1;
    this.totalOrder = 0;
    this.perPageOrder = 0;
    this.category = this.categories.find(x => x.id === sid)
    this.loadOrders(true);
  }

  // public subscribeToStations(): void {
  //   this.timerSubscription = timer(5000).subscribe(() => this.loadStationList());
  // }

  public fulfilledOrder(order, category){
    let ffo = order.fulfilled.split(',')
    return ffo.includes(category.toString())
  }

  public subscribeToOrders(refresh_time): void {
    this.timerSubscription = timer(refresh_time * 1000).subscribe(() => this.setNotification());
  }

  public setNotification(){
    this.orderService.list(this.currentPage, this.currentStation, 0, this.sortBy, this.sortOrder).subscribe(
      successResponse => {
        this.newOrder = false
        let listResponse = successResponse.json();
        if(this.totalOrder < listResponse.total){
          this.newOrder = true
          this.newOrderNumbr = listResponse.total - this.totalOrder
        }
      }
    )
    this.subscribeToOrders(this.refreshTime);
  }

  public onSelect(stationId) {
    let sid = parseInt(stationId);
    // this.stationOrders = this.orders.filter(order => order.station.id == sid)
    this.currentStation = sid;
    this.currentPage = 1;
    this.totalOrder = 0;
    this.perPageOrder = 0;
    this.station = this.stations.find(x => x.id === sid)
    this.refreshTime = this.station.refresh_time
    this.currentCategory = 0
    this.categorySelected = false
    this.loadOrders(true);
    //this.subscribeToOrders(this.refreshTime);
  }

  public callLoadOrderList(page: number) {
    if(page > 0 && ((page - 1) * this.perPageOrder) < this.totalOrder){
      this.currentPage = page;
      this.selectedPage = page;
      this.loadOrders(true);
    }
  }

  public callLoadSortOrderList(page: number, sb: string) {
    if(page > 0 && ((page - 1) * this.perPageOrder) < this.totalOrder){
      if(this.sortBy != sb){
        this.sortBy = sb;
        this.sortOrder = 'desc';
      } else {
        this.sortOrder = (this.sortOrder == 'asc' ? 'desc' : 'asc');
      }
      this.callLoadOrderList(page);
    }
  }

  public callPageLoadOrderList() {
    this.callLoadOrderList(parseInt($('#selectedPage').val()));
  }

  public loadOrders(ts: boolean){
    this.isOrdersLoading = true;
  	this.orderService.list(this.currentPage, this.currentStation, 0, this.sortBy, this.sortOrder).subscribe(
      successResponse => {
        let listResponse = successResponse.json();
        this.currentPage = listResponse.page;
        this.totalOrder = listResponse.total;
        this.perPageOrder = listResponse.per;
        this.pages = (this.totalOrder % this.perPageOrder) == 0 ? (this.totalOrder / this.perPageOrder) : (this.totalOrder / this.perPageOrder) + 1;
        // console.log(this.currentStation);
        this.station = this.stations.find(x => x.id === this.currentStation)
        this.category = this.categories.find(x => x.id === this.currentCategory)
        this.refreshTime = this.station.refresh_time
        this.loadOnlyOrderList();
        this.isOrdersLoading = false;
        this.newOrder = false
        if(ts){
          this.subscribeToOrders(this.refreshTime);
        }
      },
      (errorResponse) => {
        // this.displayErrors(errorResponse);
        this.isOrdersLoading = true;
      }
    );
  }

  public loadOnlyOrderList(){
    this.orderService.list(this.currentPage, this.currentStation, 1, this.sortBy, this.sortOrder).subscribe(
      successResponse => {
        this.orders = successResponse.json();
        this.stationOrders = this.orders; //.filter(order => order.station.id == this.currentStation);

      },
      (errorResponse) => {
        this.isOrdersLoading = false;
        // this.displayErrors(errorResponse);
      }
    );
  }

  public checkOutOrder(order){
    this.isOrderChecking = true;
    this.currentOrderId = order.id;
    this.orderService.markFulfilled(order.id).subscribe(
      successResponse => {
        this.isOrderChecking = false;
        let orderIndex = this.stationOrders.indexOf(order);
        this.stationOrders.splice(orderIndex, 1);
        this.loadOrders(false);
        // this.currentStation = order.station.next;
      },
      (errorResponse) => {
        this.isOrderChecking = false;
        // this.displayErrors(errorResponse);
      }
    );
  }

  public checkOutItemOrder(order){
    this.isOrderChecking = true;
    this.currentOrderId = order.id;
    console.log(this.currentCategory)
    this.orderService.markItemFulfilled(order.id, this.currentCategory).subscribe(
      successResponse => {
        this.isOrderChecking = false;
        let orderIndex = this.stationOrders.indexOf(order);
        this.stationOrders.splice(orderIndex, 1);
        this.loadOrders(false);
        // this.currentStation = order.station.next;
      },
      (errorResponse) => {
        this.isOrderChecking = false;
        // this.displayErrors(errorResponse);
      }
    );
  }

  public currentDate(){
    return new Date();
  }

  public printOrders(order_id) {
    order_id = parseInt(order_id);
    let ordersData = []
    let order = this.orders.find(x => x.id === order_id)
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
