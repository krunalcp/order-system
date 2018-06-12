import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { timer } from 'rxjs';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { OrderService } from '../order.service';
import { Order } from '../order';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  providers: [OrderService]
})
export class OrderListComponent implements OnInit {

  public orders: any;
  public isOrdersLoading: boolean = false;
  public isOrderDeleting: boolean = false;
  public currentOrderId: number;
  public isExporting: boolean = false;
  public timerSubscription: any;

  constructor(
  	private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit() {

  	this.loadOrderList();
  }

  public loadOrderList(){
    this.isOrdersLoading = true;
      this.orderService.list(false).subscribe(
      successResponse => {
        this.orders = successResponse.json();
        this.isOrdersLoading = false;
        // this.subscribeToData();
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

  public deleteOrder(id: number){
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

  public exportOrders() {
    this.isExporting = true;
    let ordersData = []

     this.orders.forEach(function(order) {
      order.order_items.forEach(function(orderItem) {
        let newItem = {ORDER_ID: '', ORDER_TIME: '',ORDER_REFERENCE: '',STATION: '',TOTAL_VALUE: '',ITEM: '',QUANTITY: '',VALUE: ''}
        newItem.ORDER_ID = order.id;
        newItem.ORDER_TIME = order.created_at;
        newItem.ORDER_REFERENCE = order.customer_name;
        newItem.STATION = 'S' + order.station.id + ' - ' + order.station.name;
        newItem.TOTAL_VALUE = order.value;
        newItem.ITEM = orderItem.item;
        newItem.QUANTITY = orderItem.quantity;
        newItem.VALUE = orderItem.value;

        ordersData.push(newItem);
      });
     });


    this.exportAsExcelFile(ordersData, 'ctordering');
  }

  public printOrders(order_id) {
    let ordersData = []
    let order = this.orders.find(x => x.id === order_id)
    var printSection = document.getElementById(order_id).innerHTML;
    console.log(document.getElementById(order_id).innerHTML)
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
