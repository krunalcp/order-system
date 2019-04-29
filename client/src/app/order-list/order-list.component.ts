import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { timer } from 'rxjs';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { OrderService } from '../order.service';
import { Order } from '../order';
import { EventService } from '../event.service';
import { Event } from '../event';

declare var $: any;

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  providers: [
    EventService,
    OrderService
  ]
})
export class OrderListComponent implements OnInit {

  public orders: any;
  public isOrdersLoading: boolean = false;
  public isOrderDeleting: boolean = false;
  public isOrderPrinting: boolean = false;
  public currentOrderId: number;
  public isExporting: boolean = false;
  public timerSubscription: any;
  public currentPage: number = 1;
  public sortBy: string = 'created_at';
  public sortOrder: string = 'desc';
  public totalOrder: number = 0;
  public perPageOrder: number = 0;
  public pages: number = 0;
  public selectedPage: number = 1;
  public currentEvent: Event = new Event();
	public errorMessage: any;

  constructor(
    public eventService: EventService,
    private route: ActivatedRoute,
  	private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadCurrentEvent();
  	this.loadOrderList();
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

  public callLoadOrderList(page: number) {
    if(page > 0 && ((page - 1) * this.perPageOrder) < this.totalOrder){
      this.currentPage = page;
      this.selectedPage = page;
      this.loadOrderList();
    }
  }

  public callLoadSortOrderList(page: number, sb: string) {
    if(page > 0 && ((page - 1) * this.perPageOrder) < this.totalOrder){
      if(this.sortBy != sb){
        this.sortBy = sb;
        this.sortOrder = 'desc';
      } else {
        this.sortOrder = (this.sortOrder == 'asc' ? 'desc' : 'asc');
      }
      this.callLoadOrderList(page);
    }
  }

  public callPageLoadOrderList() {
    this.callLoadOrderList(parseInt($('#selectedPage').val()));
  }

  public loadOrderList(){
    this.isOrdersLoading = true;
    this.orderService.list(this.currentPage, 0, 0, this.sortBy, this.sortOrder).subscribe(
      successResponse => {
        let listResponse = successResponse.json();
        this.currentPage = listResponse.page;
        this.totalOrder = listResponse.total;
        this.perPageOrder = listResponse.per;
        this.pages = (this.totalOrder % this.perPageOrder) == 0 ? (this.totalOrder / this.perPageOrder) : (this.totalOrder / this.perPageOrder) + 1;
        this.loadOnlyOrderList();
      },
      (errorResponse) => {
        this.isOrdersLoading = false;
        // this.displayErrors(errorResponse);
      }
    );
  }

  public loadOnlyOrderList(){
    this.isOrdersLoading = true;
    this.orderService.list(this.currentPage, 0, 1, this.sortBy, this.sortOrder).subscribe(
      successResponse => {
        this.orders = successResponse.json();
        this.isOrdersLoading = false;
        // this.subscribeToData();
        this.route.params.subscribe(
          (params: any) => {
            let id : number = params.id;
            if(this.isOrderPrinting == false && id != null ){
              this.isOrderPrinting = true;
              this.timerSubscription = timer(1000).subscribe(() => this.printOrders(id));
            }
          }
        );
      },
      (errorResponse) => {
        this.isOrdersLoading = false;
        // this.displayErrors(errorResponse);
      }
    );
  }

  public subscribeToData(): void {
    this.timerSubscription = timer(60000).subscribe(() => this.loadOrderList());
  }

  public getPrice(item){
    if(item.special_price && item.special_price != 0){
      return item.special_price
    }else{
      return item.price
    }
  }

  public deleteOrder(id: number){
    if(confirm("Are you sure?")) {
      this.isOrderDeleting = true;
      this.currentOrderId = id;
      this.orderService.remove(id).subscribe(
        successResponse => {
          this.isOrderDeleting = false;
          this.loadOrderList();
        },
        (errorResponse) => {
          this.isOrderDeleting = false;
          // this.displayErrors(errorResponse);
        }
      );
    }
  }

  public exportOrders() {
    this.isExporting = true;
    let ordersData = []

    this.orderService.listAll().subscribe(
      successResponse => {
        let allOrders = successResponse.json();

        allOrders.forEach(function(order) {
          order.order_items.forEach(function(orderItem) {
            let newItem = {ORDER_ID: '', ORDER_TIME: '', SCHEDULED_ORDER_TIME: '', ORDER_REFERENCE: '', STATION: '', IS_COMPANY_ORDER: '', ACCOUNT_ID: '', ACCOUNT_NAME: '', ACCOUNT_CONTACT_NAME: '', TOTAL_VALUE: '', ITEM: '', NOTES: '', QUANTITY: '', VALUE: ''}
            newItem.ORDER_ID = order.id;
            newItem.ORDER_TIME = order.created_at;
            newItem.SCHEDULED_ORDER_TIME = order.scheduled_order_time;
            newItem.ORDER_REFERENCE = order.customer_name;
            if(order.charge_to_account){
              newItem.IS_COMPANY_ORDER = 'Yes';
            }else{
              newItem.IS_COMPANY_ORDER = 'No';
            }
            newItem.ACCOUNT_ID = order.account_id
            if(order.account != null){
              newItem.ACCOUNT_NAME =  order.account.name;
              newItem.ACCOUNT_CONTACT_NAME = order.account.contact_name;
            }
            newItem.STATION = 'S' + order.station.id + ' - ' + order.station.name;
            newItem.TOTAL_VALUE = order.value;
            newItem.ITEM = orderItem.item;
            newItem.NOTES = orderItem.notes;
            newItem.QUANTITY = orderItem.quantity;
            newItem.VALUE = orderItem.value;

            ordersData.push(newItem);
          });
        });

        this.exportAsExcelFile(ordersData, 'ctordering');
      },
      (errorResponse) => {
        this.isExporting = false;
      }
    );
  }

  public printOrders(order_id) {
    order_id = parseInt(order_id);
    let ordersData = []
    let order = this.orders.find(x => x.id === order_id)
    var printSection = document.getElementById(order_id).innerHTML;
    var popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
            @media print
            {
              body, table {
                font-size: 7pt;
              }
              .text-center {
                text-align: center;
              }
              @page { size: 90mm; }
            }
          </style>
        </head>
        <body onload="window.print();window.close()">${printSection}</body>
      </html>`
    );
    popupWin.document.close();
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
    FileSaver.saveAs(data, fileName + '_orders_' + new Date().getTime() + EXCEL_EXTENSION);

    this.isExporting = false;
  }

}
