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
  constructor(
  	private orderService: OrderService,
    private stationService: StationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadOrders();
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

  public subscribeToOrders(): void {
    this.timerSubscription = timer(60000).subscribe(() => this.loadOrders());
  }

  public onSelect(stationId) {
    this.stationOrders = this.orders.filter(order => order.station.id == stationId)
    this.currentStation = stationId;
  }

  public loadOrders(){
    this.isOrdersLoading = true;
  	this.orderService.list(true).subscribe(
      successResponse => {
        this.orders = successResponse.json();
        this.stationOrders = this.orders.filter(order => order.station.id == this.currentStation);
        // console.log(this.currentStation);
        this.isOrdersLoading = false;
        this.subscribeToOrders();
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
        this.loadOrders();
        // this.currentStation = order.station.next;
      },
      (errorResponse) => {
        this.isOrderChecking = false;
        // this.displayErrors(errorResponse);
      }
    );
  }

}
