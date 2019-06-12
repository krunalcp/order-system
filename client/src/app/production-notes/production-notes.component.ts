import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { timer } from 'rxjs';

import { StationService } from '../station.service';
import { ItemService } from '../item.service';
import { EventService } from '../event.service';

import { Event } from '../event';

declare var $: any;
@Component({
  selector: 'app-production-notes',
  templateUrl: './production-notes.component.html',
  styleUrls: ['./production-notes.component.css'],
  providers: [ StationService, ItemService, EventService ]
})
export class ProductionNotesComponent implements OnInit {

  public stations: any;
  public items: any;
  public orderItems: any;
  public currentStation: any;
  public currentItem: any;
  public stationItem: any;
  public timerSubscription: any;
  public currentEvent: Event = new Event();
  public errorMessage: any;
  public stationItemTotal:any[] = [];
  public itemName:any[] = [];
  public currentPage: number = 1;
  public totalOrder: number = 0;
  public perPageOrder: number = 0;
  public pages: number = 0;
  public selectedPage: number = 1;
  public isOrdersLoading: boolean = false;

  constructor(
    private stationService: StationService,
    private itemService: ItemService,
    public eventService: EventService
  ) { }

  ngOnInit() {
    this.loadCurrentEvent();
    this.loadStationList();
    this.loadItemList();
    this.subscribeToData();
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
    this.stationService.list().subscribe(
      successResponse => {
        this.stations = successResponse.json();
      },
      (errorResponse) => {}
    );
  }

  public loadItemList(){
    this.itemService.list().subscribe(
      successResponse => {
        this.items = successResponse.json();
      },
      (errorResponse) => {
        // this.displayErrors(errorResponse);
      }
    );
  }

  public loadOrders(ts: boolean){
    this.isOrdersLoading = true;
  	this.itemService.productionNotes(this.currentStation, this.currentItem, this.currentPage, 0).subscribe(
      successResponse => {
        let listResponse = successResponse.json();
        this.currentPage = listResponse.page;
        this.totalOrder = listResponse.total;
        this.perPageOrder = listResponse.per;
        this.loadOnlyOrderList();
        this.pages = (this.totalOrder % this.perPageOrder) == 0 ? (this.totalOrder / this.perPageOrder) : (this.totalOrder / this.perPageOrder) + 1;
        this.isOrdersLoading = false;
        if(ts){
          this.subscribeToData();
        }
      },
      (errorResponse) => {
        this.isOrdersLoading = true;
      }
    );
  }

  public loadOnlyOrderList(){
    this.itemService.productionNotes(this.currentStation, this.currentItem,  this.currentPage, 1).subscribe(
      successResponse => {
        this.orderItems = successResponse.json();
      },
      (errorResponse) => {
        this.isOrdersLoading = false;
      }
    );
  }

  public onStationSelect(stationId) {
    let sid = $('#station').val();
    this.currentStation = sid;
    this.currentPage = 1;
    this.totalOrder = 0;
    this.perPageOrder = 0;
    this.loadOrders(false);
  }

  public onItemSelect(itemId){
    let iid = $('#item').val();
    this.currentItem = iid;
    this.currentPage = 1;
    this.totalOrder = 0;
    this.perPageOrder = 0;
    this.loadOrders(false);
  }

  public subscribeToData(): void {
    this.timerSubscription = timer(10000).subscribe(() => this.loadOrders(true));
  }

  public callPageLoadOrderList() {
    this.callLoadOrderList(parseInt($('#selectedPage').val()));
  }

  public callLoadOrderList(page: number) {
    if(page > 0 && ((page - 1) * this.perPageOrder) < this.totalOrder){
      this.currentPage = page;
      this.selectedPage = page;
      this.loadOrders(false);
    }
  }

}
