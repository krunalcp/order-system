import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AccountOrderService } from '../account_order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService } from "../services/header.service";

@Component({
  selector: 'app-account-order-login',
  templateUrl: './account-order-login.component.html',
  styleUrls: ['./account-order-login.component.css']
})
export class AccountOrderLoginComponent implements OnInit {

  signInAccount = {
    number: ''
  };

  public errors: any;
  public showHeader: boolean;
  public accountNumber: any;
  public eventName: any;
  @Output() onFormResult = new EventEmitter<any>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private flashMessage: FlashMessagesService,
    private accountOrderService: AccountOrderService,
    private header: HeaderService
  ) {
    this.header.changeMessage(false)
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: any) => {
        this.eventName = params.event;
      }
    );
  }

  public onAccountSubmit() {
    this.accountNumber = this.signInAccount.number

    this.accountOrderService.login(this.eventName, this.signInAccount).subscribe(
      res => {
        if (res.status === 200) {
          // window.location.href = '/';
          this.router.navigate([this.eventName+'/self-service/'+ this.accountNumber +'/add']);
        }
      },
      err => {
        console.log('err:', err);
        this.errors = JSON.parse(err._body).errors;
        this.flashMessage.show(this.errors, { cssClass: 'alert-danger', timeout: 2000 });
        this.onFormResult.emit({signedIn: false, err});
      }
    );
  }
}
