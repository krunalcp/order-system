import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import {Subscription} from 'rxjs';

import { CategoryService } from '../category.service';

import { Category } from '../category';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css'],
  providers: [CategoryService]
})
export class CategoryEditComponent implements OnInit {

	private categoryId: number;
	public category: Category = new Category();
	public categoryForm: FormGroup;
	public categoryUpdateRequest: Subscription;
  private isFormSubmitted: boolean;
  public isCategoryUpdating: boolean = false;

	public errorMessage: any;
  public formErrors = {
    'name': '',
    'show_order': ''
  };
  validationMessages = {
    'name': {
      'required': 'Name is required.'
    },
    'show_order': {
      'required': 'Show Order is required.'
    }
  };


  constructor(
  	private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
  	private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.buildForm();

  	this.route.params.subscribe(
      (params: any) => {
        this.categoryId = params.id;
        this.getCategory();
      }
    );

  }

  public onSubmit() {
    if(this.categoryForm.status == 'INVALID') {
      this.isFormSubmitted = true;
      this.onValueChanged();
      return;
    }
    this.category = this.categoryForm.value;
    this.isCategoryUpdating = true
    this.categoryUpdateRequest = this.categoryService.update(this.categoryId, this.category).subscribe(
      successResponse => {
        this.sucessHandler(successResponse);
        // swal({title: 'Product added successfully', type: 'success'});
      },
      errorResponse   => {
        this.errorHandler(errorResponse);
      }
    );
  }

  public cancelCategory(){
    this.router.navigate(['/category/list']);
  }

  private getCategory(): void {
    this.categoryService.show(this.categoryId).subscribe(
      successResponse => {
        let data = successResponse.json();
        this.category['name'] = data.name;
        this.category['show_order'] = data.show_order;
        this.categoryForm.patchValue(this.category);
      },
      () => {
        this.errorMessage = 'Failed to load category.';
      }
    );
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

    this.categoryForm.valueChanges.subscribe(data => this.onValueChanged(data));

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
    // this.isCategoryCreated = true;
    this.isCategoryUpdating = false;
    this.router.navigate(['/category/list']);
  }

  private errorHandler(errorResponse: Response): void {
    this.isCategoryUpdating = false;
    let data = errorResponse.json();

    if(data.errors.length > 0) {
      this.formErrors.name = data.errors.join(', ')
    }
  }

}
