import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import {Subscription} from 'rxjs';

import { StationService } from '../station.service';
import { EventService } from '../event.service';
import { Station } from '../station';
import { Event } from '../event';

@Component({
  selector: 'app-station-edit',
  templateUrl: './station-edit.component.html',
  styleUrls: ['./station-edit.component.css'],
  providers: [StationService,EventService]
})
export class StationEditComponent implements OnInit {

  private stationId: number;
  public station: Station = new Station();
  public stationForm: FormGroup;
  public stationUpdateRequest: Subscription;
  private isFormSubmitted: boolean;
  public isStationUpdating: boolean = false;
  public stations: any;
  public currentEvent: Event = new Event();

  public errorMessage: any;
  public formErrors = {
    'name': ''
  };
  validationMessages = {
    'name': {
      'required': 'Name is required.'
    }
  };


  constructor(
    public eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private stationService: StationService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.buildForm();

    this.route.params.subscribe(
      (params: any) => {
        this.stationId = params.id;
        this.getStation();
      }
    );
    this.getStationList();
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

  public onSubmit() {
    if(this.stationForm.status == 'INVALID') {
      this.isFormSubmitted = true;
      this.onValueChanged();
      return;
    }
    this.station = this.stationForm.value;
    this.isStationUpdating = true
    this.stationUpdateRequest = this.stationService.update(this.stationId, this.station).subscribe(
      successResponse => {
        this.sucessHandler(successResponse);
        // swal({title: 'Product added successfully', type: 'success'});
      },
      errorResponse   => {
        this.errorHandler(errorResponse);
      }
    );
  }

  private getStationList(): void {
    this.stationService.list().subscribe(
      successResponse => {
        this.stations = successResponse.json();
      }
    );
  }

  public cancelStation(){
    this.router.navigate(['/station/list']);
  }

  private getStation(): void {
    this.stationService.show(this.stationId).subscribe(
      successResponse => {
        let data = successResponse.json();
        this.station['name'] = data.name;
        this.station['refresh_time'] = data.refresh_time;
        this.station['next_station_id'] = data.next_station_id;
        this.station['separate_by_category'] = data.separate_by_category;
        this.stationForm.patchValue(this.station);
      },
      () => {
        this.errorMessage = 'Failed to load station.';
      }
    );
  }

  private buildForm(): void {
    this.stationForm = this.fb.group({
      'name': [
        this.station.name, [
          Validators.required,
          // Validators.maxLength(this.maxlength.title)
        ]
      ],
      'refresh_time': [
        this.station.refresh_time
      ],
      'next_station_id': [
        this.station.next_station_id
      ],
      'separate_by_category': [
        this.station.separate_by_category
      ]
    });

    this.stationForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  private onValueChanged(data?: any) {
    if (!this.stationForm) { return; }
    const form = this.stationForm;

    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && (this.isFormSubmitted || control.dirty) && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          if(this.formErrors[field].length == 0) {
            this.formErrors[field] += messages[key];
          } else {
            break;
          }
        }
      }
    }
  }

  private sucessHandler(successResponse: Response): void {
    this.isStationUpdating = false;
    this.router.navigate(['/station/list']);
  }

  private errorHandler(errorResponse: Response): void {
    this.isStationUpdating = false;
    let data = errorResponse.json();

    if(data.errors.length > 0) {
      this.errorMessage = data.errors.join(', ')
    }
  }

}
