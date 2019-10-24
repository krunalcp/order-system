import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import { formatDate } from '@angular/common';

import { AccountOrderService } from '../account_order.service';
import { HeaderService } from "../services/header.service";
import { EventOrderService } from '../event_order.service';

import { Order } from '../order';
import { Event } from '../event';

declare var $: any;

@Component({
  selector: 'app-account-order-add',
  templateUrl: './account-order-add.component.html',
  styleUrls: ['./account-order-add.component.css'],
  providers: [
    AccountOrderService,
    EventOrderService
  ]
})
export class AccountOrderAddComponent implements OnInit {

  public showHeader: boolean;
  public isAccountOrderPage: boolean;
  public items: any;
  public favourite_items: any[] = [];
	public errorMessage: any;
  public formErrors = {
    'customer_name': ''
  };
  validationMessages = {
    // 'customer_name': {
    //   'required': 'Reference is required.',
    // }
  };
  private accountNumber: string;
  private eventName: string;
  public orderForm: FormGroup;
	public order : Order = new Order();
	public orderAddRequest: Subscription;
  private isFormSubmitted: boolean;
  public isOrderAdding: boolean = false;
  public stations: any;
  public accounts: any;
  public currentEvent: Event = new Event();
  public accountId: any;
  public showErrorMessage: boolean;

  constructor(
    private accountOrderService: AccountOrderService,
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
        this.accountNumber = params.accountNumber;
        this.eventName = params.event
        this.loadCurrentEvent();
      }
    );
    this.isAccountOrderPage = true;
    this.showErrorMessage = false
  }


  private loadCurrentEvent(): void {
    this.eventOrderService.currentEvent(this.eventName).subscribe(
      successResponse => {
        this.currentEvent = successResponse.json();
        // Set Title
        document.title = this.currentEvent.published_name
        this.loadItems();
        this.buildForm();
      },
      () => {
        this.errorMessage = 'Failed to load Event.';
      }
    );
  }

  public loadItems(){
    this.eventOrderService.activeItem(this.eventName, this.accountId).subscribe(
      successResponse => {
        this.items = successResponse.json();
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

  public getPrice(item){
    if(item.special_price && item.special_price != 0){
      return item.special_price
    }else{
      return item.price
    }
  }

  get totalPrice() {
    let total = 0;

    if (this.items){
      this.items.forEach(function(item) {
        total += this.getPrice(item) * item.quantity
      }, this);
      this.favourite_items.forEach(function(item) {
        total += this.getPrice(item) * item.quantity
      }, this);

      return total;
    }
    else{
      return 0;
    }

  }

  public onSubmit() {
    if(!this.isOrderAdding){
      if(this.orderForm.status == 'INVALID') {
        this.isFormSubmitted = true;
        this.onValueChanged();
        return;
      }
      this.order = this.orderForm.value;
      this.order.scheduled_order_time = $("#scheduled_order_time").val();
      this.order.order_items = this.items.filter(item => item.quantity > 0)
      this.order.value = this.totalPrice;
      this.isOrderAdding = true;
      this.orderAddRequest = this.accountOrderService.add(this.order, this.eventName, this.accountNumber).subscribe(
        successResponse => {
          this.sucessHandler(successResponse);
        },
        errorResponse   => {
          this.errorHandler(errorResponse);
        }
      );
    }
  }

  private buildForm(): void {
    this.orderForm = this.fb.group({
      'customer_name': [
        this.order.customer_name
      ],
      'station_id': [
        this.order.station_id
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

  public onItemSelect(item_ids){
    for (let item_id of item_ids) {
      this.items.find(x => x.id === item_id).selected = true
    }
  }

  private sucessHandler(successResponse: Response): void {
    this.isOrderAdding = false;
    var response = successResponse.json()
    this.router.navigate([this.eventName+'/self-service/'+this.accountNumber+'/confirmed/'+response.id]);
  }

  private errorHandler(errorResponse: Response): void {
    this.isOrderAdding = false;
    let data = errorResponse.json();

    if(data.errors.length > 0) {
      this.errorMessage = data.errors.join(', ')
    }
  }

  public changeEventOrder(){
    this.isAccountOrderPage = true;
  }

  public placeEventOrder(){
    this.order = this.orderForm.value;
    this.order.order_items = this.items.filter(item => item.quantity > 0).concat(this.favourite_items.filter(item => item.quantity > 0))
    if (this.order.account_id == null) {
      this.order.account_id = this.accountId;
    }
    if(this.orderForm.status == 'INVALID' || this.order.account_id == null) {
      alert('Please select account!');
      return;
    }
    if(this.orderForm.status == 'INVALID' || this.order.order_items.length == 0) {
      alert('Please add items!');
      return;
    }
    this.order.value = this.totalPrice;

    this.isAccountOrderPage = false;
  }

  public removeSpace(category) {
    return category.replace(/[^A-Z0-9]+/ig, '')
  }
}
