import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import { Subscription } from 'rxjs';

import { EventService } from '../event.service';
import { OrderService } from '../order.service';
import { HostappService } from '../hostapp.service';

import { Event } from '../event';

declare var $: any;

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css'],
  providers: [EventService]
})
export class EventEditComponent implements OnInit {

	private eventId: number;
	public event: Event = new Event();
  public currentEvent: Event = new Event();
	public eventForm: FormGroup;
	public eventUpdateRequest: Subscription;
  private isFormSubmitted: boolean;
  public isEventUpdating: boolean = false;
  public stations: any;

	public errorMessage: any;
  public formErrors = {
    'name': '',
    'published_name': '',
    'station_id': '',
    'second_station_id': '',
    'gst_number': '',
    'admin': '',
    'active': '',
    'logo': '',
    'icon': '',
    'password': '',
    'item_image': '',
    'help_url' : '',
    'event_help_url' : '',
    'show_date': '',
    'is_one_off' : '',
    'start_date' : '',
    'end_date' : '',
    'earliest_preorder_date': '',
    'latest_preorder_date': '',
    'printed_image': '',
    'banner_message': '',
    'printouts_email': '',
    'phone_number': '',
    'total_costs': '',
    'number_of_tiles': '',
    'disable_print_popup': '',
    'disable_print_popup_customer': '',
    'comments_label': ''
  };
  validationMessages = {
    'name': {
      'required': 'Name is required.'
    },
    'published_name': {
      'required': 'Published Name is required.'
    },
    'gst_number': {
      'required': 'Gst Number is required.'
    },
    'password': {
      'required': 'Password is required.'
    }
  };

  constructor(
  	private orderService: OrderService,
  	private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    public hostAppService: HostappService,
  	private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.loadCurrentEvent();
    this.buildForm();

  	this.route.params.subscribe(
      (params: any) => {
        this.eventId = params.id;
        this.getEvent();
      }
    );
  }

  ngAfterViewChecked() {
    this.initDatePicker();
  }

  public initDatePicker(): void {
    $("#end_date, #start_date, #earliest_preorder_date, #latest_preorder_date").datetimepicker({
      format: 'dd-mm-yyyy hh:ii',
      autoclose: true,
      minuteStep: 15,
    });
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
    if(this.eventForm.status == 'INVALID') {
      this.isFormSubmitted = true;
      this.onValueChanged();
      return;
    }
    this.event = this.eventForm.value;
    this.event.start_date = $("#start_date").val();
    this.event.end_date = $("#end_date").val();
    this.event.earliest_preorder_date = $("#earliest_preorder_date").val();
    this.event.latest_preorder_date = $("#latest_preorder_date").val();
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
    this.router.navigate(['/site/list']);
  }

  private getEvent(): void {
    this.eventService.show(this.eventId).subscribe(
      successResponse => {
        let data = successResponse.json();
        this.event['name'] = data.name;
        this.event['published_name'] = data.published_name;
        this.event['station_id'] = data.station_id;
        this.event['second_station_id'] = data.second_station_id;
        this.event['gst_number'] = data.gst_number;
        this.event['admin'] = data.admin;
        this.event['active'] = data.active;
        this.event['logo'] = data.logo;
        this.event['icon'] = data.icon;
        this.event['item_image'] = data.item_image;
        this.event['id'] = data.id;
        this.event['help_url'] = data.help_url;
        this.event['event_help_url'] = data.event_help_url;
        this.event['show_date'] = data.show_date;
        this.event['is_one_off'] = data.is_one_off;
        this.event['start_date'] = data.start_date;
        this.event['end_date'] = data.end_date;
        this.event['earliest_preorder_date'] = data.earliest_preorder_date;
        this.event['latest_preorder_date'] = data.latest_preorder_date;
        this.event['printed_image'] = data.printed_image;
        this.event['banner_message'] = data.banner_message
        this.event['printouts_email'] = data.printouts_email
        this.event['phone_number'] = data.phone_number
        this.event['total_costs'] = data.total_costs
        this.event['number_of_tiles'] = data.number_of_tiles
        this.event['disable_print_popup'] = data.disable_print_popup
        this.event['disable_print_popup_customer'] = data.disable_print_popup_customer
        this.event['comments_label'] = data.comments_label
        this.eventForm.patchValue(this.event);
        this.getStationList();
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
          Validators.required
        ]
      ],
      'published_name': [
        this.event.published_name, [
          Validators.required
        ]
      ],
      'station_id': [
        this.event.station_id
      ],
      'second_station_id': [
        this.event.second_station_id
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
      'logo': [
        this.event.logo
      ],
      'icon': [
        this.event.icon
      ],
      'item_image': [
        this.event.item_image
      ],
      'password': [
        ''
      ],
      'help_url': [
        this.event.help_url
      ],
      'event_help_url': [
        this.event.event_help_url
      ],
      'show_date':[
        this.event.show_date
      ],
      'is_one_off':[
        this.event.is_one_off
      ],
      'start_date':[
        this.event.start_date
      ],
      'end_date':[
        this.event.end_date
      ],
      'earliest_preorder_date':[
        this.event.earliest_preorder_date
      ],
      'latest_preorder_date':[
        this.event.latest_preorder_date
      ],
      'printed_image':[
        this.event.printed_image
      ],
      'banner_message':[
        this.event.banner_message
      ],
      'printouts_email':[
        this.event.printouts_email
      ],
      'phone_number':[
        this.event.phone_number
      ],
      'total_costs':[
        this.event.total_costs
      ],
      'number_of_tiles':[
        this.event.number_of_tiles
      ],
      'disable_print_popup':[
        this.event.disable_print_popup
      ],
      'disable_print_popup_customer':[
        this.event.disable_print_popup_customer
      ],
      'comments_label':[
        this.event.comments_label
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
    this.router.navigate(['/site/list']);
  }

  private errorHandler(errorResponse: Response): void {
    this.isEventUpdating = false;
    let data = errorResponse.json();

    if(data.errors.length > 0) {
      this.formErrors.name = data.errors.join(', ')
    }
  }

  private getStationList(): void {
    this.orderService.event_stations(this.event.id).subscribe(
      successResponse => {
        this.stations = successResponse.json();
      }
    );
  }
}
