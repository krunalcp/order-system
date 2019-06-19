import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { OrderService } from '../order.service';
import { EventService } from '../event.service';
import { ItemService } from '../item.service';
import { AccountService } from '../account.service';

import { Order } from '../order';
import { Event } from '../event';

declare var $: any;

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.css'],
  providers: [OrderService, EventService]
})
export class OrderEditComponent implements OnInit {

	public errorMessage: any;
  public formErrors = {
    'customer_name': ''
  };
  validationMessages = {
    // 'customer_name': {
    //   'required': 'Reference is required.',
    // }
  };

	private orderId: number;
  public orderForm: FormGroup;
	public order : Order = new Order();
	public orderUpdateRequest: Subscription;
  private isFormSubmitted: boolean;
  public isOrderUpdating: boolean = false;
  public items: any;
  public isItemsFilled: boolean = false;
  public stations: any;
  public accounts: any;
  public currentEvent: Event = new Event();

  constructor(
    public eventService: EventService,
  	private orderService: OrderService,
  	private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private itemService: ItemService,
    private accountService: AccountService,
  ) { }

  ngOnInit() {
    this.loadCurrentEvent();
  	this.buildForm();

  	this.route.params.subscribe(
      (params: any) => {
        this.orderId = params.id;
        this.getOrder();
        this.getStationList();
        this.getAccountList();
      }
    );
  }

  ngAfterViewChecked() {
    this.initDatePicker();
  }

  private loadCurrentEvent(): void {
    this.eventService.current().subscribe(
      successResponse => {
        this.currentEvent = successResponse.json();
        this.buildForm();
      },
      () => {
        this.errorMessage = 'Failed to load Event.';
      }
    );
  }

  public loadItems(order){
    this.itemService.activeItem().subscribe(
      successResponse => {
        let data = successResponse.json();
        this.fillChoosanQuantity(data, order);
      }
    );
  }

  public fillChoosanQuantity(items, order) {
    items.forEach(function(item) {
      let itemIndex = items.indexOf(item);
      order.order_items.forEach(function(orderItem) {
        if (orderItem.item == item.name){
          items[itemIndex].quantity = orderItem.quantity;
          items[itemIndex].notes = orderItem.notes;
        }
      });
    });
    this.items = items;
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

      return total;
    }
    else{
      return 0;
    }

  }

  private getOrder(): void {
    this.orderService.show(this.orderId).subscribe(
      successResponse => {
        let data = successResponse.json();
        this.order = data
        this.orderForm.patchValue(this.order);
        this.loadItems(data);
      },
      () => {
        this.errorMessage = 'Failed to load order.';
      }
    );
  }

  private getStationList(): void {
    this.orderService.stations().subscribe(
      successResponse => {
        this.stations = successResponse.json();
      }
    );
  }

  private getAccountList(): void {
    this.accountService.active_list().subscribe(
      successResponse => {
        this.accounts = successResponse.json();
      }
    );
  }

  public onSubmit() {
    if(this.orderForm.status == 'INVALID') {
      this.isFormSubmitted = true;
      this.onValueChanged();
      return;
    }
    this.order = this.orderForm.value;
    this.order.scheduled_order_time = $("#scheduled_order_time").val();
    this.order.order_items = this.items.filter(item => item.quantity > 0);
    this.order.value = this.totalPrice;
    this.isOrderUpdating = true;
    this.orderUpdateRequest = this.orderService.update(this.orderId, this.order).subscribe(
      successResponse => {
        this.sucessHandler(successResponse);
        // swal({title: 'Product added successfully', type: 'success'});
      },
      errorResponse   => {
        this.errorHandler(errorResponse);
      }
    );
  }

  public cancelOrder(){
    this.router.navigate(['/order/list']);
  }

  public toggleCategory(category) {
    $(".category_" + this.removeSpace(category)).toggle();
  }

  public removeSpace(category) {
    return category.replace(/[^A-Z0-9]+/ig, '')
  }

  private buildForm(): void {
    this.orderForm = this.fb.group({
      'customer_name': [
        this.order.customer_name
      ],
      'station_id': [
        this.order.station
      ],
      'account_id': [
        this.order.account
      ],
      'scheduled_order_time': [
        this.order.scheduled_order_time
      ],
      'comments': [
        this.order.comments
      ],
      'order_number': [
        this.order.order_number
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
    this.isOrderUpdating = false;
    this.router.navigate(['/order/list']);
  }

  private errorHandler(errorResponse: Response): void {
    this.isOrderUpdating = false;
    let data = errorResponse.json();

    if(data.errors.length > 0) {
      this.errorMessage = data.errors.join(', ')
    }
  }

  public initDatePicker(): void {
    var self = this;
    $("#scheduled_order_time").datetimepicker({
      fontAwesome: true,
      format: 'dd-mm-yyyy hh:ii',
      autoclose: true,
      minuteStep: 15,
    })
  }


}
