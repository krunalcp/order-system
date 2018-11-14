import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css'],
  providers: [ItemService]
})
export class OrderSummaryComponent implements OnInit {

  public orderSummary: any;
  public stations: any;
  public isItemsLoading: boolean = false;
  public timerSubscription: any;
  public s_type: string = 'quantity';

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.loadItemList(true, 'quantity');
  }

  public loadItemList(ts: boolean, type: string){
    this.isItemsLoading = true;
    if (ts) {
      this.s_type = type;
    }
    this.itemService.listSummary(this.s_type).subscribe(
      successResponse => {
        this.orderSummary = successResponse.json();
        this.stations = this.orderSummary[0].stations
        this.isItemsLoading = false;
        // if(ts){
        //   this.subscribeToData();
        // }
      },
      (errorResponse) => {
        // this.displayErrors(errorResponse);
      }
    );
  }

  public subscribeToData(): void {
    this.timerSubscription = timer(60000).subscribe(() => this.loadItemList(false, this.s_type));
  }

}
