import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { ItemService } from '../item.service';

import { Item } from '../item';

@Component({
  selector: 'app-item-add',
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.css'],
  providers: [ItemService]
})
export class ItemAddComponent implements OnInit {

  public errorMessage: any;
  public formErrors = {
    'name': '',
    'price': '',
    'order_no': ''
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

  constructor(
  	private itemService: ItemService,
  	private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.buildForm();
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
          Validators.required,
          // Validators.maxLength(this.maxlength.description)
        ]
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
