import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { AccountService } from '../account.service';
import { Account } from '../account';
import { EventService } from '../event.service';
import { Event } from '../event';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css'],
  providers: [
    AccountService,
    EventService
  ]
})
export class AccountListComponent implements OnInit {

	public accounts: any;
  public isAccountsLoading: boolean = false;
  public isAccountDeleting: boolean = false;
  public currentAccountId: number;
  public currentEvent: Event = new Event();
	public errorMessage: any;

  constructor(
    public eventService: EventService,
  	private accountService: AccountService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadCurrentEvent();
  	this.loadAccountList();
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
    if(confirm("Are you sure?")) {
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

  public getCurrentTime(){
    return new Date();
  }

  public printOrders(id) {
    var account_id = parseInt(id);
    var printSection = document.getElementById('account_' + account_id).innerHTML;
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
}
