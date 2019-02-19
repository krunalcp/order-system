import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import {Subscription} from 'rxjs';

import { EventService } from '../event.service';

import { Event } from '../event';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css'],
  providers: [EventService]
})
export class EventEditComponent implements OnInit {

	private eventId: number;
	public event: Event = new Event();
	public eventForm: FormGroup;
	public eventUpdateRequest: Subscription;
  private isFormSubmitted: boolean;
  public isEventUpdating: boolean = false;

	public errorMessage: any;
  public formErrors = {
    'name': '',
    'gst_number': '',
    'admin': '',
    'active': '',
    'password': ''
  };
  validationMessages = {
    'name': {
      'required': 'Name is required.'
    },
    'gst_number': {
      'required': 'Gst Number is required.'
    },
    'password': {
      'required': 'Password is required.'
    }
  };


  constructor(
  	private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
  	private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.buildForm();

  	this.route.params.subscribe(
      (params: any) => {
        this.eventId = params.id;
        this.getEvent();
      }
    );

  }

  public onSubmit() {
    if(this.eventForm.status == 'INVALID') {
      this.isFormSubmitted = true;
      this.onValueChanged();
      return;
    }
    this.event = this.eventForm.value;
    this.isEventUpdating = true
    this.eventUpdateRequest = this.eventService.update(this.eventId, this.event).subscribe(
      successResponse => {
        this.sucessHandler(successResponse);
        // swal({title: 'Product added successfully', type: 'success'});
      },
      errorResponse   => {
        this.errorHandler(errorResponse);
      }
    );
  }

  public cancelEvent(){
    this.router.navigate(['/event/list']);
  }

  private getEvent(): void {
    this.eventService.show(this.eventId).subscribe(
      successResponse => {
        let data = successResponse.json();
        this.event['name'] = data.name;
        this.event['gst_number'] = data.gst_number;
        this.event['admin'] = data.admin;
        this.event['active'] = data.active;
        this.eventForm.patchValue(this.event);
      },
      () => {
        this.errorMessage = 'Failed to load event.';
      }
    );
  }

  private buildForm(): void {
    this.eventForm = this.fb.group({
      'name': [
        this.event.name, [
          Validators.required,
          // Validators.maxLength(this.maxlength.title)
        ]
      ],
      'gst_number': [
        this.event.gst_number
      ],
      'admin': [
        this.event.admin
      ],
      'active': [
        this.event.active
      ],
      'password': [
        ''
      ]
    });

    this.eventForm.valueChanges.subscribe(data => this.onValueChanged(data));

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
    // this.event = successResponse.json();
    // this.isEventCreated = true;
    this.isEventUpdating = false;
    this.router.navigate(['/event/list']);
  }

  private errorHandler(errorResponse: Response): void {
    this.isEventUpdating = false;
    let data = errorResponse.json();

    if(data.errors.length > 0) {
      this.formErrors.name = data.errors.join(', ')
    }
  }

}
