import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { timer } from 'rxjs';

import { OrderService } from '../order.service';
import { StationService } from '../station.service';

import { Order } from '../order';

@Component({
  selector: 'app-station-orders',
  templateUrl: './station-orders.component.html',
  styleUrls: ['./station-orders.component.css'],
  providers: [
    OrderService,
    StationService
  ]
})
export class StationOrdersComponent implements OnInit {

  public orders: any;
  public stations: any;
  public isOrdersLoading: boolean = false;
  public isOrderChecking: boolean = false;
  public currentOrderId: number;
  public currentStation: any;
  public stationOrders: any;
  public lastStation: any;
  public selectedStation: any;
  public timerSubscription: any;
  public station: any;
  public refreshTime: number;
  public currentPage: number = 1;
  public totalOrder: number = 0;
  public perPageOrder: number = 0;

  constructor(
  	private orderService: OrderService,
    private stationService: StationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadStationList();
  }

  public loadStationList(){
    // this.isStationsLoading = true;
    this.stationService.list().subscribe(
      successResponse => {
        this.stations = successResponse.json();
        this.selectedStation = this.stations[0];
        this.currentStation = this.stations[0].id;
        let last = this.stations.length;
        this.lastStation = this.stations[last - 1].id;
        this.loadOrders(true);
        // this.subscribeToStations();
      },
      (errorResponse) => {
        // this.displayErrors(errorResponse);
      }
    );
  }

  // public subscribeToStations(): void {
  //   this.timerSubscription = timer(5000).subscribe(() => this.loadStationList());
  // }

  public subscribeToOrders(refresh_time): void {
    this.timerSubscription = timer(refresh_time * 1000).subscribe(() => this.loadOrders(true));
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
    this.loadOrders(true);
    //this.subscribeToOrders(this.refreshTime);
  }

  public callLoadOrderList(page: number) {
    if(page > 0 && ((page - 1) * this.perPageOrder) < this.totalOrder){
      this.currentPage = page;
      this.loadOrders(true);
    }
  }

  public loadOrders(ts: boolean){
    this.isOrdersLoading = true;
  	this.orderService.list(this.currentPage, this.currentStation, 0).subscribe(
      successResponse => {
        let listResponse = successResponse.json();
        this.orders = listResponse.orders;
        this.stationOrders = this.orders; //.filter(order => order.station.id == this.currentStation);
        this.currentPage = listResponse.page;
        this.totalOrder = listResponse.total;
        this.perPageOrder = listResponse.per;
        // console.log(this.currentStation);
        this.station = this.stations.find(x => x.id === this.currentStation)
        this.refreshTime = this.station.refresh_time
        this.isOrdersLoading = false;
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

}
