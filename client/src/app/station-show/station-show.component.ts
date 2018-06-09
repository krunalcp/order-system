import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { StationService } from '../station.service';

import { Station } from '../station';

@Component({
  selector: 'app-station-show',
  templateUrl: './station-show.component.html',
  styleUrls: ['./station-show.component.css']
})
export class StationShowComponent implements OnInit {

  public errorMessage: any;
  public station: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stationService: StationService
  ) { }

  ngOnInit() {

    this.route.params.subscribe(
      (params: any) => {
        let id : number = params.id;
        this.getStation(id);
      }
    );
  }

  private getStation(id: number): void {
    this.stationService.show(id).subscribe(
      successResponse => {
        this.station = successResponse.json();
      },
      () => {
        this.errorMessage = 'Failed to load station.';
      }
    );
  }

}
