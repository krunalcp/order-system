import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import {Subscription} from 'rxjs';

import { ItemService } from '../item.service';
import { CategoryService } from '../category.service';

import { Item } from '../item';

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.css'],
  providers: [
    ItemService,
    CategoryService
  ]
})
export class ItemEditComponent implements OnInit {

	private itemId: number;
	public item: Item = new Item();
	public itemForm: FormGroup;
	public itemUpdateRequest: Subscription;
  private isFormSubmitted: boolean;
  public isItemUpdating: boolean = false;
  public categories: any;

	public errorMessage: any;
  public formErrors = {
    'name': '',
    'price': '',
    'order_no': '',
    'category_id': '',
    'image': ''
  };
  validationMessages = {
    'name': {
      'required': 'Name is required.'
    },
    'price': {
      'required': 'Price is required.'
    },
    'order_no': {
      'required': 'Order no is required.'
    }
  };


  constructor(
  	private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService,
  	private fb: FormBuilder,
    private categoryService: CategoryService,
  ) { }

  ngOnInit() {

    this.buildForm();

  	this.route.params.subscribe(
      (params: any) => {
        this.itemId = params.id;
        this.getItem();
        this.getCategoryList();
      }
    );

  }

  public onSubmit() {
    if(this.itemForm.status == 'INVALID') {
      this.isFormSubmitted = true;
      this.onValueChanged();
      return;
    }
    this.item = this.itemForm.value;
    this.isItemUpdating = true
    this.itemUpdateRequest = this.itemService.update(this.itemId, this.item).subscribe(
      successResponse => {
        this.sucessHandler(successResponse);
        // swal({title: 'Product added successfully', type: 'success'});
      },
      errorResponse   => {
        this.errorHandler(errorResponse);
      }
    );
  }

  public cancelItem(){
    this.router.navigate(['/item/list']);
  }

  private getItem(): void {
    this.itemService.show(this.itemId).subscribe(
      successResponse => {
        let data = successResponse.json();
        this.item['name'] = data.name;
        this.item['price'] = data.price;
        this.item['order_no'] = data.order_no;
        this.item['item_used'] = data.item_used;
        this.item['category_id'] = data.category_id;
        this.item['image'] = data.image;
        this.item['active'] = data.active;
        this.item['special_price'] = data.special_price;
        this.itemForm.patchValue(this.item);
      },
      () => {
        this.errorMessage = 'Failed to load item.';
      }
    );
  }

  private buildForm(): void {
    this.itemForm = this.fb.group({
      'name': [
        this.item.name, [
          Validators.required,
          // Validators.maxLength(this.maxlength.title)
        ]
      ],
      'price': [
        this.item.price, [
          Validators.required,
          // Validators.maxLength(this.maxlength.description)
        ]
      ],
      'order_no': [
        this.item.order_no, [
          Validators.required,
          // Validators.maxLength(this.maxlength.description)
        ]
      ],
      'category_id': [
        this.item.category_id
      ],
      'image': [
        this.item.image
      ],
      'active': [
        this.item.active
      ],
      'special_price': [
        this.item.special_price
      ]
    });

    this.itemForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  private onValueChanged(data?: any) {
    if (!this.itemForm) { return; }
    const form = this.itemForm;

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

  private getCategoryList(): void {
    this.categoryService.list().subscribe(
      successResponse => {
        this.categories = successResponse.json();
      }
    );
  }

  private sucessHandler(successResponse: Response): void {
    // this.item = successResponse.json();
    // this.isItemCreated = true;
    this.isItemUpdating = false;
    this.router.navigate(['/item/list']);
  }

  private errorHandler(errorResponse: Response): void {
    this.isItemUpdating = false;
    let data = errorResponse.json();

    if(data.errors.length > 0) {
      this.formErrors.name = data.errors.join(', ')
    }
  }

}
