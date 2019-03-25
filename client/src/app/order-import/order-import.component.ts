import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import { OrderService } from '../order.service';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-order-import',
  templateUrl: './order-import.component.html',
  styleUrls: ['./order-import.component.css'],
  providers: [
    OrderService
  ]
})
export class OrderImportComponent implements OnInit {
  public errorMessage: any;
  public isOrderImporting: boolean = false;
  public arrayBuffer: any;
  public file: File;
  public imported_orders: any;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  public upload() {
    this.isOrderImporting = true;
    let fileReader = new FileReader();
      fileReader.onload = (e) => {
          this.arrayBuffer = fileReader.result;
          var data = new Uint8Array(this.arrayBuffer);
          var arr = new Array();
          for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
          var bstr = arr.join("");
          var workbook = XLSX.read(bstr, {type:"binary"});
          var first_sheet_name = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[first_sheet_name];
          var orders = XLSX.utils.sheet_to_json(worksheet,{raw:true})
          this.orderService.import(orders).subscribe(
            successResponse => {
              this.sucessHandler(successResponse);
            }
          );
      }
      fileReader.readAsArrayBuffer(this.file);
  }

  private sucessHandler(successResponse: Response): void {
    this.isOrderImporting = false;
    this.imported_orders = successResponse.json();
  }

  public incomingfile(event) 
  {
    this.file= event.target.files[0]; 
  }

  public cancelImportOrder(){
    this.router.navigate(['/order/list']);
  }

}
