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
    this.eventOrderService.activeItem(this.eventName, this.accountId).subscribe(
      successResponse => {
        this.items = successResponse.json();
      }
    );
  }

  public loadFavouriteItem(){
    this.eventOrderService.favouriteItems(this.eventName, this.accountId).subscribe(
      successResponse => {
        this.favourite_items = successResponse.json();
        console.log(this.favourite_items)
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

  public favouriteQuantityOptions(item, operation) {
    let itemIndex = this.favourite_items.indexOf(item);

    if (operation == 'plus' && this.favourite_items[itemIndex].quantity >= 0) {
      this.favourite_items[itemIndex].quantity += 1;
    }
    else if (operation == 'minus' && this.favourite_items[itemIndex].quantity > 0) {
      this.favourite_items[itemIndex].quantity -= 1;
    }
  }

  public notesOptions(item) {
    let itemIndex = this.items.indexOf(item);
    this.items[itemIndex].notes = $("#item_notes_" + item.id).val();
  }

  public notesfavouriteOptions(item) {
    let itemIndex = this.favourite_items.indexOf(item);
    this.favourite_items[itemIndex].notes = $("#item_notes_" + item.id).val();
  }

  public defaultQuantityOptions(item, event) {
    let itemIndex = this.favourite_items.indexOf(item);
    this.favourite_items[itemIndex].default_quantity = event.target.checked
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
    if(this.orderForm.status == 'INVALID') {
      this.isFormSubmitted = true;
      this.onValueChanged();
      return;
    }
    this.order = this.orderForm.value;
    this.order.order_items = this.items.filter(item => item.quantity > 0).concat(this.favourite_items.filter(item => item.quantity > 0))
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
    this.router.navigate(['/siteorder/list']);
  }

  public changeEventOrder(){
    this.isEventOrderPage = true;
  }

  public placeEventOrder(){
    this.order = this.orderForm.value;
    this.order.order_items = this.items.filter(item => item.quantity > 0).concat(this.favourite_items.filter(item => item.quantity > 0))
    console.log(this.order.order_items)
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

  public favourite(item_id){
    this.eventOrderService.favourite(this.eventName, item_id, this.accountId).subscribe(
      successResponse => {
        this.loadItems();
        this.loadFavouriteItem();
      },
      () => {
        this.errorMessage = 'Failed to load order.';
      }
    );
  }

  public removeFavourite(item_id){
    this.eventOrderService.remove_favourite(this.eventName, item_id, this.accountId).subscribe(
      successResponse => {
        this.loadItems();
        this.loadFavouriteItem();
      },
      () => {
        this.errorMessage = 'Failed to load order.';
      }
    );
  }

  public saveDefaultQuantity(item_id, quantity){
    this.eventOrderService.saveDefaultQuantity(this.eventName, item_id, this.accountId, quantity).subscribe(
      successResponse => {
        this.loadItems();
        this.loadFavouriteItem();
      },
      () => {
        this.errorMessage = 'Failed to load order.';
      }
    );
  }

  public onAccountSelect(account_id){
    this.accountId = account_id
    this.loadItems();
    this.loadFavouriteItem();
  }

  public toggleAllCategory() {
    $(".all_category").toggle();
    $(".category_color_down").toggle();
    $(".category_color_up").toggle();
    if($(".all_category").css('display') == 'none') {
      $("#expand-button").text('Expand all Categories');
    } else {
      $("#expand-button").text('Collapse all Categories');
    }
  }

}
