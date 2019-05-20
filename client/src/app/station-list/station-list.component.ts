import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { StationService } from '../station.service';
import { EventService } from '../event.service';
import { Station } from '../station';
import { Event } from '../event';
 
@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.css'],
  providers: [StationService]
})
export class StationListComponent implements OnInit {

  public stations: any;
  public isStationsLoading: boolean = false;
  public isStationDeleting: boolean = false;
  public currentStationId: number;
  public currentEvent: Event = new Event();
  public errorMessage: any;
  constructor(
    public eventService: EventService,  
    private stationService: StationService,
    private router: Router
  ) { }

  ngOnInit() {

    this.loadStationList();
    this.loadCurrentEvent();
  }

  private loadCurrentEvent(): void {
    this.eventService.current().subscribe(
      successResponse => {
        this.currentEvent = successResponse.json();
      () => {
        this.errorMessage = 'Failed to load Event.';
      }
    );
  }
  
  public loadStationList(){
    this.isStationsLoading = true;
    this.stationService.list().subscribe(
      successResponse => {
        this.stations = successResponse.json();
        this.isStationsLoading = false;
      },
      (errorResponse) => {
        // this.displayErrors(errorResponse);
      }
    );
  }

  public deleteStation(id: number){
    if(confirm("Are you sure?")) {
      this.currentStationId = id;
      this.isStationDeleting = true;
      this.stationService.remove(id).subscribe(
        successResponse => {
          this.isStationDeleting = false;
          this.loadStationList();
        },
        (errorResponse) => {
          this.isStationDeleting = false;
          // this.displayErrors(errorResponse);
        }
      );
    }
  }

}
