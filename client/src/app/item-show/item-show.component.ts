import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ItemService } from '../item.service';

import { Item } from '../item';

@Component({
  selector: 'app-item-show',
  templateUrl: './item-show.component.html',
  styleUrls: ['./item-show.component.css']
})
export class ItemShowComponent implements OnInit {

  public errorMessage: any;
  public item: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService
  ) { }

  ngOnInit() {

  	this.route.params.subscribe(
      (params: any) => {
        let id : number = params.id;
        this.getItem(id);
      }
    );
  }

  private getItem(id: number): void {
    this.itemService.show(id).subscribe(
      successResponse => {
        this.item = successResponse.json();
      },
      () => {
        this.errorMessage = 'Failed to load item.';
      }
    );
  }


}
