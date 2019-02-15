import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { CategoryService } from '../category.service';

import { Category } from '../category';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  providers: [CategoryService]
})
export class CategoryListComponent implements OnInit {

	public categories: any;
  public isCategoriesLoading: boolean = false;
  public isCategoryDeleting: boolean = false;
  public currentCategoryId: number;

  constructor(
  	private categoryService: CategoryService,
    private router: Router
  ) { }

  ngOnInit() {

  	this.loadCategoryList();
  }

  public loadCategoryList(){
    this.isCategoriesLoading = true;
  	this.categoryService.list().subscribe(
      successResponse => {
        this.categories = successResponse.json();
        this.isCategoriesLoading = false;
      },
      (errorResponse) => {
        // this.displayErrors(errorResponse);
      }
    );
  }

  public deleteCategory(id: number){
    this.currentCategoryId = id;
    this.isCategoryDeleting = true;
    this.categoryService.remove(id).subscribe(
      successResponse => {
        this.isCategoryDeleting = false;
        this.loadCategoryList();
      },
      (errorResponse) => {
        this.isCategoryDeleting = false;
        // this.displayErrors(errorResponse);
      }
    );
  }
}
