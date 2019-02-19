import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { AccountService } from '../account.service';

import { Account } from '../account';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css'],
  providers: [AccountService]
})
export class AccountListComponent implements OnInit {

	public accounts: any;
  public isAccountsLoading: boolean = false;
  public isAccountDeleting: boolean = false;
  public currentAccountId: number;

  constructor(
  	private accountService: AccountService,
    private router: Router
  ) { }

  ngOnInit() {

  	this.loadAccountList();
  }

  public loadAccountList(){
    this.isAccountsLoading = true;
  	this.accountService.list().subscribe(
      successResponse => {
        this.accounts = successResponse.json();
        this.isAccountsLoading = false;
      },
      (errorResponse) => {
        // this.displayErrors(errorResponse);
      }
    );
  }

  public deleteAccount(id: number){
    this.currentAccountId = id;
    this.isAccountDeleting = true;
    this.accountService.remove(id).subscribe(
      successResponse => {
        this.isAccountDeleting = false;
        this.loadAccountList();
      },
      (errorResponse) => {
        this.isAccountDeleting = false;
        // this.displayErrors(errorResponse);
      }
    );
  }
}
