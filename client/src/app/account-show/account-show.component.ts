import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AccountService } from '../account.service';

import { Account } from '../account';

@Component({
  selector: 'app-account-show',
  templateUrl: './account-show.component.html',
  styleUrls: ['./account-show.component.css']
})
export class AccountShowComponent implements OnInit {

  public errorMessage: any;
  public account: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) { }

  ngOnInit() {

  	this.route.params.subscribe(
      (params: any) => {
        let id : number = params.id;
        this.getAccount(id);
      }
    );
  }

  private getAccount(id: number): void {
    this.accountService.show(id).subscribe(
      successResponse => {
        this.account = successResponse.json();
        console.log(successResponse.json())
      },
      () => {
        this.errorMessage = 'Failed to load account.';
      }
    );
  }


}
