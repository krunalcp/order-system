import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CategoryService } from '../category.service';

import { Category } from '../category';

@Component({
  selector: 'app-category-show',
  templateUrl: './category-show.component.html',
  styleUrls: ['./category-show.component.css']
})
export class CategoryShowComponent implements OnInit {

  public errorMessage: any;
  public category: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {

  	this.route.params.subscribe(
      (params: any) => {
        let id : number = params.id;
        this.getCategory(id);
      }
    );
  }

  private getCategory(id: number): void {
    this.categoryService.show(id).subscribe(
      successResponse => {
        this.category = successResponse.json();
        console.log(successResponse.json())
      },
      () => {
        this.errorMessage = 'Failed to load category.';
      }
    );
  }


}
