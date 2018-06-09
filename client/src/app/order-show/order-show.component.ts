import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { OrderService } from '../order.service';

import { Order } from '../order';

@Component({
  selector: 'app-order-show',
  templateUrl: './order-show.component.html',
  styleUrls: ['./order-show.component.css']
})
export class OrderShowComponent implements OnInit {

  public errorMessage: any;
  public order: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) { }

  ngOnInit() {

  	this.route.params.subscribe(
      (params: any) => {
        let id : number = params.id;
        this.getorder(id);
      }
    );
  }

  private getorder(id: number): void {
    this.orderService.show(id).subscribe(
      successResponse => {
        this.order = successResponse.json();
      },
      () => {
        this.errorMessage = 'Failed to load order.';
      }
    );
  }


}
