import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { ItemService } from '../item.service';
import { Item } from '../item';
import { EventService } from '../event.service';
import { Event } from '../event';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

declare var $: any;

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
  providers: [
    EventService,
    ItemService
  ]
})
export class ItemListComponent implements OnInit {

	public items: any;
  public isItemsLoading: boolean = false;
  public isActiveItemsLoading: boolean = true;
  public isNonActiveItemsLoading: boolean = false;
  public isItemDeleting: boolean = false;
  public currentItemId: number;
  public isExporting: boolean = false;
  public currentEvent: Event = new Event();
	public errorMessage: any;

  constructor(
    public eventService: EventService,
  	private itemService: ItemService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadCurrentEvent();
  	this.loadItemList();
  }

  private loadCurrentEvent(): void {
    this.eventService.current().subscribe(
      successResponse => {
        this.currentEvent = successResponse.json();
      },
      () => {
        this.errorMessage = 'Failed to load Event.';
      }
    );
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

  public hideInActiveItems(){
    this.isActiveItemsLoading = true;
    this.isNonActiveItemsLoading = false;
    this.itemService.activeItem().subscribe(
      successResponse => {
        this.items = successResponse.json();
        this.isActiveItemsLoading = false;
        this.isNonActiveItemsLoading = true;
      },
      (errorResponse) => {
        // this.displayErrors(errorResponse);
      }
    );
  }

  public showInActiveItems(){
    this.isNonActiveItemsLoading = true;
    this.isActiveItemsLoading = false;
    this.itemService.nonActiveItem().subscribe(
      successResponse => {
        this.items = successResponse.json();
        this.isActiveItemsLoading = true;
        this.isNonActiveItemsLoading = false;
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

  public exportItems() {
    this.isExporting = true;
    let itemsData = []

    this.itemService.list().subscribe(
      successResponse => {
        let allItems = successResponse.json();

          allItems.forEach(function(item) {
            let newItem = {Name: '', Price: '', SpecialPrice: '', Order: '', Active: '', Category: '', Image: ''}
            newItem.Name = item.name;
            newItem.Price = item.price;
            newItem.SpecialPrice = item.special_price;
            newItem.Order = item.order_no;
            if(item.active){
              newItem.Active = 'Yes';
            }else{
              newItem.Active = 'No';
            }
            newItem.Category =  item.category_name;
            newItem.Image = item.image;
            itemsData.push(newItem);
          });

        this.exportAsExcelFile(itemsData, 'ctordering');
      },
      (errorResponse) => {
        this.isExporting = false;
      }
    );
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_items_' + new Date().getTime() + EXCEL_EXTENSION);

    this.isExporting = false;
  }

  public toggleCategory(category) {
    $(".category_" + this.removeSpace(category)).toggle();
    $(".i_" + this.removeSpace(category)).toggle();
  }

  public toggleAllCategory(category) {
    console.log($(".all_category"));
    $(".all_category").toggle();
    $(".category_color_down").toggle();
    $(".category_color_up").toggle();
  }
  
  public removeSpace(category) {
    return category.replace(/[^A-Z0-9]+/ig, '')
  }

  public getPrice(item){
    if(item.special_price && item.special_price != 0){
      return item.special_price
    }else{
      return item.price
    }
  }
}
