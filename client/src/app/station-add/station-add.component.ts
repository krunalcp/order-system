import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { StationService } from '../station.service';
import { EventService } from '../event.service';
import { Station } from '../station';
import { Event } from '../event';

@Component({
  selector: 'app-station-add',
  templateUrl: './station-add.component.html',
  styleUrls: ['./station-add.component.css'],
  providers: [StationService, EventService]
})
export class StationAddComponent implements OnInit {

  public errorMessage: any;
  public formErrors = {
    'name': ''
  };
  validationMessages = {
    'name': {
      'required': 'Name is required.',
    }
  };

  public stationForm: FormGroup;
  public station : Station = new Station();
  public stationAddRequest: Subscription;
  private isFormSubmitted: boolean;
  public isStationAdding: boolean = false;
  public stations: any;
  public currentEvent: Event = new Event();

  constructor(
    private stationService: StationService,
    private eventService: EventService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.buildForm();
    this.getStationList();
    this.loadCurrentEvent();
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

  public onSubmit() {
    if(this.stationForm.status == 'INVALID') {
      this.isFormSubmitted = true;
      this.onValueChanged();
      return;
    }
    this.station = this.stationForm.value;
    this.isStationAdding = true;
    this.stationAddRequest = this.stationService.add(this.station).subscribe(
      successResponse => {
        this.sucessHandler(successResponse);
        // swal({title: 'Product added successfully', type: 'success'});
      },
      errorResponse   => {
        this.errorHandler(errorResponse);
      }
    );
  }

  public cancelStation(){
    this.router.navigate(['/station/list']);
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

    this.stationForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  private getStationList(): void {
    this.stationService.list().subscribe(
      successResponse => {
        this.stations = successResponse.json();
      }
    );
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
    this.isStationAdding = false;
    this.router.navigate(['/station/list']);
  }

  private errorHandler(errorResponse: Response): void {
    let data = errorResponse.json();

    if(data.errors.length > 0) {
      this.errorMessage = data.errors.join(', ')
    }
  }

}
