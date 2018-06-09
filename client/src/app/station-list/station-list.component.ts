import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { StationService } from '../station.service';

import { Station } from '../station';

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

  constructor(
    private stationService: StationService,
    private router: Router
  ) { }

  ngOnInit() {

    this.loadStationList();
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
