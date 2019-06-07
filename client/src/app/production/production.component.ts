import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { timer } from 'rxjs';

import { StationService } from '../station.service';
import { ItemService } from '../item.service';

import { Event } from '../event';
import { Item } from '../item';
@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.css'],
  providers: [ StationService, ItemService ]
})
export class ProductionComponent implements OnInit {

  public stations: any;
  public items: any;
  public currentStation: number;
  public currentItem: number;
  public stationItem: any;
  public timerSubscription: any;

  constructor(
    private stationService: StationService,
    private itemService: ItemService
  ) { }

  ngOnInit() {
    this.loadStationList();
    this.loadItemList();
    this.subscribeToData();
  }

  public loadStationList(){
    this.stationService.list().subscribe(
      successResponse => {
        this.stations = successResponse.json();;
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

  public loadStationItemNumber(ts: boolean){
    if(this.currentStation && this.currentItem){
      this.itemService.stationItem(this.currentStation, this.currentItem).subscribe(
        successResponse => {
          this.stationItem = successResponse.json();
        },
        (errorResponse) => {}
      )
    }else{
      this.stationItem = 0
    }
    if(ts){
      this.subscribeToData()
    }
  }

  public onItemSelect(itemId){
    let iid = parseInt(itemId);
    this.currentItem = iid
    this.loadStationItemNumber(false)
  }

  public onStationSelect(stationId) {
    let sid = parseInt(stationId);
    this.currentStation = sid;
    this.loadStationItemNumber(false)
  }

  public subscribeToData(): void {
    this.timerSubscription = timer(10000).subscribe(() => this.loadStationItemNumber(true));
  }

}
