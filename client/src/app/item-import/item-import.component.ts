import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import { ItemService } from '../item.service';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-item-import',
  templateUrl: './item-import.component.html',
  styleUrls: ['./item-import.component.css'],
  providers: [
    ItemService
  ]
})
export class ItemImportComponent implements OnInit {
  public errorMessage: any;
  public isItemImporting: boolean = false;
  public arrayBuffer: any;
  public file: File;
  public imported_items: any;

  constructor(
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  public upload() {
    this.isItemImporting = true;
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
          this.itemService.import(items).subscribe(
            successResponse => {
              this.sucessHandler(successResponse);
            }
          );
          
          console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
      }
      fileReader.readAsArrayBuffer(this.file);
  }

  private sucessHandler(successResponse: Response): void {
    // this.item = successResponse.json();
    // this.isItemCreated = true;
    this.isItemImporting = false;
    console.log(successResponse.json())
    this.imported_items = successResponse.json();
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
