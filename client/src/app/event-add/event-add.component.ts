import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { EventService } from '../event.service';
import { OrderService } from '../order.service';
import { AccountService } from '../account.service';

import { Event } from '../event';

declare var $: any;

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
    'second_station_id': '',
    'gst_number': '',
    'active': '',
    'admin': '',
    'logo': '',
    'icon': '',
    'password': '',
    'item_image': '',
    'help_url' : '',
    'event_help_url' : '',
    'show_date': '',
    'is_one_off' : '',
    'start_date': '',
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
    'show_station_list': '',
    'comments_label': '',
    'website': '',
    'account_id': '',
    'hide_site_page': '',
    'admin_password': '',
    'hide_event_help_url': '',
    'hide_help_url': ''
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
  public accounts: any;

  constructor(
    private orderService: OrderService,
    private eventService: EventService,
    private accountService: AccountService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.buildForm();
    this.getStationList();
    this.getAccountList();
  }

  ngAfterViewChecked() {
    this.initDatePicker();
  }

  public initDatePicker(): void {
    $("#end_date, #start_date, #earliest_preorder_date, #latest_preorder_date").datetimepicker({
      fontAwesome: true,
      format: 'dd-mm-yyyy hh:ii',
      autoclose: true,
      minuteStep: 15,
    });
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
    this.router.navigate(['/site/list']);
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
      'second_station_id': [
        this.event.second_station_id
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
      'item_image': [
        this.event.item_image
      ],
      'admin': [
        this.event.admin
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
      'printed_image': [
        this.event.printed_image
      ],
      'banner_message': [
        this.event.banner_message
      ],
      'printouts_email': [
        this.event.printouts_email
      ],
      'phone_number': [
        this.event.phone_number
      ],
      'total_costs': [
        this.event.total_costs
      ],
      'number_of_tiles': [
        this.event.number_of_tiles
      ],
      'disable_print_popup': [
        this.event.disable_print_popup
      ],
      'disable_print_popup_customer': [
        this.event.disable_print_popup_customer
      ],
      'show_station_list': [
        this.event.show_station_list
      ],
      'comments_label': [
        this.event.comments_label
      ],
      'website': [
        this.event.website
      ],
      'account_id': [
        this.event.account_id
      ],
      'hide_site_page':[
        this.event.hide_site_page
      ],
      'admin_password':[
        this.event.admin_password
      ],
      'hide_help_url':[
        this.event.hide_help_url
      ],
      'hide_event_help_url':[
        this.event.hide_event_help_url
      ]
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
    this.router.navigate(['/site/list']);
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
  private getAccountList(): void {
    this.accountService.list().subscribe(
      successResponse => {
        this.accounts = successResponse.json();
      }
    );
  }
}
