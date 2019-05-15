import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Http } from '@angular/http';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Angular2TokenService } from 'angular2-token';
import { NgFlashMessagesModule } from 'ng-flash-messages';

import { AppComponent } from './app.component';
import { ItemListComponent } from './item-list/item-list.component';
import { HomeComponent } from './home/home.component';
import { ItemAddComponent } from './item-add/item-add.component';
import { ItemShowComponent } from './item-show/item-show.component';
import { ItemEditComponent } from './item-edit/item-edit.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderShowComponent } from './order-show/order-show.component';
import { OrderAddComponent } from './order-add/order-add.component';
import { OrderEditComponent } from './order-edit/order-edit.component';
import { StationOrdersComponent } from './station-orders/station-orders.component';
import { StationListComponent } from './station-list/station-list.component';
import { StationShowComponent } from './station-show/station-show.component';
import { StationAddComponent } from './station-add/station-add.component';
import { StationEditComponent } from './station-edit/station-edit.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryAddComponent } from './category-add/category-add.component';
import { CategoryShowComponent } from './category-show/category-show.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventAddComponent } from './event-add/event-add.component';
import { EventShowComponent } from './event-show/event-show.component';
import { EventEditComponent } from './event-edit/event-edit.component';
import { MainPipe } from './main-pipe.module';
import { LoginFormComponent } from './login-form/login-form.component';
import {AuthService} from './services/auth.service';
import {AuthGuard} from './guards/auth.guard';
import { AccountAddComponent } from './account-add/account-add.component';
import { AccountListComponent } from './account-list/account-list.component';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { AccountShowComponent } from './account-show/account-show.component';
import { EventOrderAddComponent } from './event-order-add/event-order-add.component';
import { HeaderService } from './services/header.service';
import { EventOrderListComponent } from './event-order-list/event-order-list.component';
import { EventOrderConfirmedComponent } from './event-order-confirmed/event-order-confirmed.component';
import { ItemImportComponent } from './item-import/item-import.component';
import { OrderImportComponent } from './order-import/order-import.component';

const appRoutes: Routes = [
	{
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginFormComponent
  },
	{
    path: 'item/list',
    component: ItemListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'item/add',
    component: ItemAddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'item/show/:id',
    component: ItemShowComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'item/edit/:id',
    component: ItemEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'item/import',
    component: ItemImportComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'category/list',
    component: CategoryListComponent
  },
  {
    path: 'category/add',
    component: CategoryAddComponent
  },
  {
    path: 'category/show/:id',
    component: CategoryShowComponent
  },
  {
    path: 'category/edit/:id',
    component: CategoryEditComponent
  },
  {
    path: 'site/list',
    component: EventListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'site/add',
    component: EventAddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'site/show/:id',
    component: EventShowComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'site/edit/:id',
    component: EventEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'order/list',
    component: OrderListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'order/list/:id',
    component: OrderListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'order/show/:id',
    component: OrderShowComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'order/add',
    component: OrderAddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'order/edit/:id',
    component: OrderEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'order/import',
    component: OrderImportComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'station/order',
    component: StationOrdersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'station/list',
    component: StationListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'station/show/:id',
    component: StationShowComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'station/add',
    component: StationAddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'station/edit/:id',
    component: StationEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'order/summary',
    component: OrderSummaryComponent,
    canActivate: [AuthGuard]
  },
	{
    path: 'account/list',
    component: AccountListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'account/add',
    component: AccountAddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'account/show/:id',
    component: AccountShowComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'account/edit/:id',
    component: AccountEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':event/order',
    component: EventOrderAddComponent
  },
	{
		path: ':event/order/confirmed/:id',
		component: EventOrderConfirmedComponent
	},
  {
    path: 'siteorder/list',
    component: EventOrderListComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    ItemListComponent,
    HomeComponent,
    ItemAddComponent,
    ItemShowComponent,
    ItemEditComponent,
    OrderListComponent,
    OrderShowComponent,
    OrderAddComponent,
    OrderEditComponent,
    StationOrdersComponent,
    StationListComponent,
    StationShowComponent,
    StationAddComponent,
    StationEditComponent,
    OrderSummaryComponent,
    CategoryListComponent,
    CategoryAddComponent,
    CategoryShowComponent,
    CategoryEditComponent,
    EventListComponent,
    EventAddComponent,
    EventShowComponent,
    EventEditComponent,
    LoginFormComponent,
    AccountAddComponent,
    AccountListComponent,
    AccountEditComponent,
    AccountShowComponent,
    EventOrderAddComponent,
    EventOrderListComponent,
		EventOrderConfirmedComponent,
    ItemImportComponent,
    OrderImportComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    Angular2FontawesomeModule,
    FormsModule,
    ReactiveFormsModule,
    MainPipe,
    NgFlashMessagesModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true, useHash: true } // <-- debugging purposes only
    )
  ],
  providers: [Angular2TokenService, AuthService, AuthGuard, HeaderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
