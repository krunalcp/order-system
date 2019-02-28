import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { EventService } from '../event.service';
import { OrderService } from '../order.service';

import { Event } from '../event';

@Component({
  selector: 'app-event-add',
  templateUrl: './event-add.component.html',
  styleUrls: ['./event-add.component.css'],
  providers: [EventService]
})
export class EventAddComponent implements OnInit {

  public errorMessage: any;
  public formErrors = {
    'name': '',
    'published_name': '',
    'station_id': '',
    'gst_number': '',
    'active': '',
    'admin': '',
    'logo': '',
    'icon': '',
    'password': ''
  };
  validationMessages = {
    'name': {
      'required': 'Name is required.',
    },
    'published_name': {
      'required': 'Published Name is required.',
    },
    'password': {
      'required': 'Password is required.'
    }
  };

	public eventForm: FormGroup;
	public event : Event = new Event();
	public eventAddRequest: Subscription;
  private isFormSubmitted: boolean;
  public isEventAdding: boolean = false;
  public stations: any;

  constructor(
    private orderService: OrderService,
    private eventService: EventService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.buildForm();
    this.getStationList();
  }

  public onSubmit() {
    if(this.eventForm.status == 'INVALID') {
      this.isFormSubmitted = true;
      this.onValueChanged();
      return;
    }
    this.event = this.eventForm.value;
    this.isEventAdding = true;
    this.eventAddRequest = this.eventService.add(this.event).subscribe(
      successResponse => {
        this.sucessHandler(successResponse);
        // swal({title: 'Product added successfully', type: 'success'});
      },
      errorResponse => {
        this.errorHandler(errorResponse);
      }
    );
  }

  public cancelEvent(){
    this.router.navigate(['/event/list']);
  }

  private buildForm(): void {
    this.eventForm = this.fb.group({
      'name': [
        this.event.name, [
          Validators.required,
          // Validators.maxLength(this.maxlength.title)
        ]
      ],
      'published_name': [
        this.event.published_name, [
          Validators.required,
          // Validators.maxLength(this.maxlength.title)
        ]
      ],
      'station_id': [
        this.event.station_id
      ],
      'password': [
        this.event.gst_number
      ],
      'gst_number': [
        this.event.gst_number
      ],
      'active': [
        this.event.active
      ],
      'logo': [
        this.event.logo
      ],
      'icon': [
        this.event.icon
      ],
      'admin': [
        this.event.admin
      ],
    });

    this.eventForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  private onValueChanged(data?: any) {
    if (!this.eventForm) { return; }
    const form = this.eventForm;

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
    this.isEventAdding = false;
    this.router.navigate(['/event/list']);
  }

  private errorHandler(errorResponse: Response): void {
    this.isEventAdding = false;
    let data = errorResponse.json();

    if(data.errors.length > 0) {
      this.formErrors.name = data.errors.join(', ')
    }
  }

  private getStationList(): void {
    this.orderService.stations().subscribe(
      successResponse => {
        this.stations = successResponse.json();
      }
    );
  }
}
