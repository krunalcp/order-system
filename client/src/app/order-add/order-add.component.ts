import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { OrderService } from '../order.service';
import { ItemService } from '../item.service';

import { Order } from '../order';

declare var $: any;

@Component({
  selector: 'app-order-add',
  templateUrl: './order-add.component.html',
  styleUrls: ['./order-add.component.css'],
  providers: [
    OrderService,
    ItemService
  ]
})
export class OrderAddComponent implements OnInit {

  public items: any;
	public errorMessage: any;
  public formErrors = {
    'customer_name': ''
  };
  validationMessages = {
    'customer_name': {
      'required': 'Reference is required.',
    }
  };

  public orderForm: FormGroup;
	public order : Order = new Order();
	public orderAddRequest: Subscription;
  private isFormSubmitted: boolean;
  public isOrderAdding: boolean = false;


  constructor(
  	private orderService: OrderService,
    private itemService: ItemService,
  	private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

  	this.buildForm();
    this.loadItems();
  }

  public loadItems(){
    this.itemService.list().subscribe(
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
    console.log(this.order.order_items);
    this.orderAddRequest = this.orderService.add(this.order).subscribe(
      successResponse => {
        this.sucessHandler(successResponse);
      },
      errorResponse   => {
        this.errorHandler(errorResponse);
      }
    );
  }

  public cancelOrder(){
    this.router.navigate(['/order/list']);
  }


  private buildForm(): void {
    this.orderForm = this.fb.group({
      'customer_name': [
        this.order.customer_name, [
          Validators.required,
          // Validators.maxLength(this.maxlength.title)
        ]
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
    this.router.navigate(['/order/list']);
  }

  private errorHandler(errorResponse: Response): void {
    this.isOrderAdding = false;
    let data = errorResponse.json();

    if(data.errors.length > 0) {
      this.errorMessage = data.errors.join(', ')
    }
  }

}
