import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { ItemService } from '../item.service';
import { CategoryService } from '../category.service';

import { Item } from '../item';

declare var $: any;

@Component({
  selector: 'app-item-add',
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.css'],
  providers: [
    ItemService,
    CategoryService
  ]
})
export class ItemAddComponent implements OnInit {

  public errorMessage: any;
  public formErrors = {
    'name': '',
    'price': '',
    'order_no': '',
    'category_id': '',
    'image': '',
    'special_price': ''
  };
  validationMessages = {
    'name': {
      'required': 'Name is required.',
    },
    'price': {
      'required': 'Price is required.',
    },
    'order_no': {
      'required': 'Order no is required.',
    }
  };

	public itemForm: FormGroup;
	public item : Item = new Item();
	public itemAddRequest: Subscription;
  private isFormSubmitted: boolean;
  public isItemAdding: boolean = false;
  public categories: any;

  constructor(
  	private itemService: ItemService,
  	private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.getCategoryList();
  }

  public getLastOrderNumber(): void {
    let categoryID = $("#category_id").val()
    if(categoryID != ""){
      this.itemService.lastOrderNumber(categoryID).subscribe(
        successResponse => {
          $("#order_no").val(successResponse.json());
        }
      );
    }
  }

  public onSubmit() {
    if(this.itemForm.status == 'INVALID') {
      this.isFormSubmitted = true;
      this.onValueChanged();
      return;
    }
    this.item = this.itemForm.value;
    this.isItemAdding = true;
    this.itemAddRequest = this.itemService.add(this.item).subscribe(
      successResponse => {
        this.sucessHandler(successResponse);
        // swal({title: 'Product added successfully', type: 'success'});
      },
      errorResponse => {
        this.errorHandler(errorResponse);
      }
    );
  }

  public cancelItem(){
    this.router.navigate(['/item/list']);
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
          // Validators.required,
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
        true
      ],
      'special_price':[
        this.item.special_price
      ]
    });

    this.itemForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

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
    this.isItemAdding = false;
    this.router.navigate(['/item/list']);
  }

  private errorHandler(errorResponse: Response): void {
    this.isItemAdding = false;
    let data = errorResponse.json();

    if(data.errors.length > 0) {
      this.formErrors.name = data.errors.join(', ')
    }
  }
}
