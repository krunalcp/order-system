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
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.css'],
  providers: [ StationService, ItemService, EventService ]
})
export class ProductionComponent implements OnInit {

  public stations: any;
  public items: any;
  public currentStation: any;
  public currentItem: number;
  public stationItem: any;
  public timerSubscription: any;
  public currentEvent: Event = new Event();
  public errorMessage: any;
  public stationItemTotal:any[] = [];
  public itemName:any[] = [];

  constructor(
    private stationService: StationService,
    private itemService: ItemService,
    public eventService: EventService
  ) { }

  ngOnInit() {
    this.loadCurrentEvent();
    this.loadStationList();
    this.loadItemList();
  }

  private loadCurrentEvent(): void {
    this.eventService.current().subscribe(
      successResponse => {
        this.currentEvent = successResponse.json();
        this.initializeTimeSubscription();
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

  public loadStationItemNumber(id: any, ts: boolean){
    let currentItem = $('#item-'+id).val()
    this.itemName[id] = $('#item-'+id+ ' option:selected').text()
    let currentStation = $('#station-'+id).val()
    if(currentItem && currentStation){
      this.itemService.stationItem(currentStation, currentItem).subscribe(
        successResponse => {
          this.stationItemTotal[id] = successResponse.json();
        },
        (errorResponse) => {}
      )
    }else{
      this.stationItemTotal[id] = 0
    }
    if(ts){
      this.subscribeToData(id)
    }
  }

  public initializeTimeSubscription(){
    for(let i = 1; i <= this.currentEvent.number_of_tiles; i++){
      this.subscribeToData(i)
    }
  }

  public subscribeToData(id): void {
    this.timerSubscription = timer(10000).subscribe(() => this.loadStationItemNumber(id, true));
  }

  public toggle_navbar(id){
    $(".station-select-"+id).toggle();
    $(".item-select-"+id).toggle();
    $(".fa-caret-down-"+id).toggle();
    $(".fa-caret-up-"+id).toggle();
  }
}
