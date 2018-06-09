import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { ItemService } from '../item.service';

import { Item } from '../item';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
  providers: [ItemService]
})
export class ItemListComponent implements OnInit {

	public items: any;
  public isItemsLoading: boolean = false;
  public isItemDeleting: boolean = false;
  public currentItemId: number;

  constructor(
  	private itemService: ItemService,
    private router: Router
  ) { }

  ngOnInit() {

  	this.loadItemList();
  }

  public loadItemList(){
    this.isItemsLoading = true;
  	this.itemService.list().subscribe(
      successResponse => {
        this.items = successResponse.json();
        this.isItemsLoading = false;
      },
      (errorResponse) => {
        // this.displayErrors(errorResponse);
      }
    );
  }

  public deleteItem(id: number){
    this.currentItemId = id;
    this.isItemDeleting = true;
    this.itemService.remove(id).subscribe(
      successResponse => {
        this.isItemDeleting = false;
        this.loadItemList();
      },
      (errorResponse) => {
        this.isItemDeleting = false;
        // this.displayErrors(errorResponse);
      }
    );
  }
}
