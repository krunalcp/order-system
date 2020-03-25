import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import { ItemService } from '../item.service';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-item-price-import',
  templateUrl: './item-price-import.component.html',
  styleUrls: ['./item-price-import.component.css'],
  providers: [
    ItemService
  ]
})
export class ItemPriceImportComponent implements OnInit {
  public errorMessage: any;
  public isItemPriceImporting: boolean = false;
  public isItemPriceBeforeImporting: boolean = false;
  public arrayBuffer: any;
  public file: File;
  public imported_items: any;
  public before_imported_items: any;
  public afterItemPriceImported: boolean = false;

  constructor(
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  public checkUpload() {
    this.isItemPriceBeforeImporting = true;
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
          var items = XLSX.utils.sheet_to_json(worksheet,{raw:true})
          this.itemService.check_import_price(items).subscribe(
            successResponse => {
              // this.sucessHandler(successResponse);
              this.isItemPriceBeforeImporting = false;
              this.before_imported_items = successResponse.json();
            }
          );
      }
      fileReader.readAsArrayBuffer(this.file);
  }


  public upload() {
    this.isItemPriceImporting = true;
      this.itemService.import_price(this.before_imported_items).subscribe(
        successResponse => {
          this.sucessHandler(successResponse);
        }
      );
  }

  private sucessHandler(successResponse: Response): void {
    // this.item = successResponse.json();
    // this.isItemCreated = true;
    this.isItemPriceImporting = false;
    this.imported_items = successResponse.json();
    this.afterItemPriceImported = true
    // this.router.navigate(['/item/list']);
  }

  public incomingfile(event)
  {
    this.file= event.target.files[0];
  }

  public cancelImportItem(){
    this.router.navigate(['/item/list']);
  }
}
