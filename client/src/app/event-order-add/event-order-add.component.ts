import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { EventOrderService } from '../event_order.service';
import { HeaderService } from "../services/header.service";

import { Order } from '../order';
import { Event } from '../event';

declare var $: any;

@Component({
  selector: 'app-event-order-add',
  templateUrl: './event-order-add.component.html',
  styleUrls: ['./event-order-add.component.css'],
  providers: [
    EventOrderService
  ]
})
export class EventOrderAddComponent implements OnInit {

  public showHeader: boolean;
  public isEventOrderPage: boolean;
  public items: any;
	public errorMessage: any;
  public formErrors = {
    'customer_name': ''
  };
  validationMessages = {
    // 'customer_name': {
    //   'required': 'Reference is required.',
    // }
  };
  private eventName: string;
  public orderForm: FormGroup;
	public order : Order = new Order();
	public orderAddRequest: Subscription;
  private isFormSubmitted: boolean;
  public isOrderAdding: boolean = false;
  public stations: any;
  public accounts: any;
  public currentEvent: Event = new Event();

  constructor(
  	private eventOrderService: EventOrderService,
  	private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private header: HeaderService
  ) {
    this.header.changeMessage(false)
  }

  ngOnInit() {
  	this.buildForm();
    this.route.params.subscribe(
      (params: any) => {
        this.eventName = params.event;
        this.loadCurrentEvent();
      }
    );
    this.loadItems();
    this.getStationList();
    this.getAccountList();
    this.isEventOrderPage = true;
  }

  private loadCurrentEvent(): void {
    this.eventOrderService.currentEvent(this.eventName).subscribe(
      successResponse => {
        this.currentEvent = successResponse.json();
        // Set Title
        document.title = this.currentEvent.published_name
        this.buildForm();
      },
      () => {
        this.errorMessage = 'Failed to load Event.';
      }
    );
  }

  public loadItems(){
    this.eventOrderService.activeItem(this.eventName).subscribe(
      successResponse => {
        this.items = successResponse.json();
      }
    );
  }

  private getStationList(): void {
    this.eventOrderService.stations(this.eventName).subscribe(
      successResponse => {
        this.stations = successResponse.json();
      }
    );
  }

  private getAccountList(): void {
    this.eventOrderService.accounts(this.eventName).subscribe(
      successResponse => {
        this.accounts = successResponse.json();
      }
    );
  }

  public quantityOptions(item, operation) {
    let itemIndex = this.items.indexOf(item);

    if (operation == 'plus' && this.items[itemIndex].quantity >= 0) {
      this.items[itemIndex].quantity += 1;
    }
    else if (operation == 'minus' && this.items[itemIndex].quantity > 0) {
      this.items[itemIndex].quantity -= 1;
    }
  }

  public notesOptions(item) {
    let itemIndex = this.items.indexOf(item);
    this.items[itemIndex].notes = $("#item_notes_" + item.id).val();
  }

  get totalPrice() {
    let total = 0;

    if (this.items){
      this.items.forEach(function(item) {
        total += item.price * item.quantity
      });

      return total;
    }
    else{
      return 0;
    }

  }

  public onSubmit() {
    if(this.orderForm.status == 'INVALID') {
      this.isFormSubmitted = true;
      this.onValueChanged();
      return;
    }
    this.order = this.orderForm.value;
    this.order.order_items = this.items.filter(item => item.quantity > 0)
    this.order.value = this.totalPrice;
    this.isOrderAdding = true;
    this.orderAddRequest = this.eventOrderService.add(this.order, this.eventName).subscribe(
      successResponse => {
        this.sucessHandler(successResponse);
      },
      errorResponse   => {
        this.errorHandler(errorResponse);
      }
    );
  }

  private buildForm(): void {
    this.orderForm = this.fb.group({
      'customer_name': [
        this.order.customer_name
      ],
      'station_id': [
        this.currentEvent.station_id
      ],
      'account_id': [
        this.order.account_id
      ],
      'scheduled_order_time': [
        this.order.scheduled_order_time
      ],
      'comments': [
        this.order.comments
      ]
    });

    this.orderForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  private onValueChanged(data?: any) {
    if (!this.orderForm) { return; }
    const form = this.orderForm;

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
    this.isOrderAdding = false;
    var response = successResponse.json()
    this.router.navigate([this.eventName+'/order/confirmed/'+response.id]);
  }

  private errorHandler(errorResponse: Response): void {
    this.isOrderAdding = false;
    let data = errorResponse.json();

    if(data.errors.length > 0) {
      this.errorMessage = data.errors.join(', ')
    }
  }

  public cancelEventOrder(){
    this.router.navigate(['/eventorder/list']);
  }

  public changeEventOrder(){
    this.isEventOrderPage = true;
  }

  public placeEventOrder(){
    this.order = this.orderForm.value;
    this.order.order_items = this.items.filter(item => item.quantity > 0);
    if(this.orderForm.status == 'INVALID' || this.order.order_items.length == 0) {
      alert('Please add items!');
      return;
    }
    this.order.value = this.totalPrice;

    this.isEventOrderPage = false;
  }

  public toggleCategory(category) {
    $(".category_" + this.removeSpace(category)).toggle();
    $(".i_" + this.removeSpace(category)).toggle();
  }

  public removeSpace(category) {
    return category.replace(/[^A-Z0-9]+/ig, '')
  }
}
