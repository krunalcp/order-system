import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { CategoryService } from '../category.service';

import { Category } from '../category';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.css'],
  providers: [CategoryService]
})
export class CategoryAddComponent implements OnInit {

  public errorMessage: any;
  public formErrors = {
    'name': '',
    'show_order': ''
  };
  validationMessages = {
    'name': {
      'required': 'Name is required.',
    },
    'show_order': {
      'required': 'Price is required.',
    }
  };

	public categoryForm: FormGroup;
	public category : Category = new Category();
	public categoryAddRequest: Subscription;
  private isFormSubmitted: boolean;
  public isCategoryAdding: boolean = false;

  constructor(
  	private categoryService: CategoryService,
  	private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  public onSubmit() {
    if(this.categoryForm.status == 'INVALID') {
      this.isFormSubmitted = true;
      this.onValueChanged();
      return;
    }
    this.category = this.categoryForm.value;
    this.isCategoryAdding = true;
    this.categoryAddRequest = this.categoryService.add(this.category).subscribe(
      successResponse => {
        this.sucessHandler(successResponse);
        // swal({title: 'Product added successfully', type: 'success'});
      },
      errorResponse => {
        this.errorHandler(errorResponse);
      }
    );
  }

  public cancelCategory(){
    this.router.navigate(['/category/list']);
  }

  private buildForm(): void {
    this.categoryForm = this.fb.group({
      'name': [
        this.category.name, [
          Validators.required,
          // Validators.maxLength(this.maxlength.title)
        ]
      ],
      'show_order': [
        this.category.show_order, [
          Validators.required,
          // Validators.maxLength(this.maxlength.description)
        ]
      ]
    });

    this.categoryForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  private onValueChanged(data?: any) {
    if (!this.categoryForm) { return; }
    const form = this.categoryForm;

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
    // this.category = successResponse.json();
    // this.isItemCreated = true;
    this.isCategoryAdding = false;
    this.router.navigate(['/category/list']);
  }

  private errorHandler(errorResponse: Response): void {
    this.isCategoryAdding = false;
    let data = errorResponse.json();

    if(data.errors.length > 0) {
      this.formErrors.name = data.errors.join(', ')
    }
  }
}
