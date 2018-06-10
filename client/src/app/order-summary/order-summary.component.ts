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

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.loadItemList();
  }

  public loadItemList(){
    this.isItemsLoading = true;
    this.itemService.listSummary().subscribe(
      successResponse => {
        this.orderSummary = successResponse.json();
        this.stations = this.orderSummary[0].stations
        this.isItemsLoading = false;
        this.subscribeToData();
      },
      (errorResponse) => {
        // this.displayErrors(errorResponse);
      }
    );
  }

  public subscribeToData(): void {
    this.timerSubscription = timer(5000).subscribe(() => this.loadItemList());
  }

}
