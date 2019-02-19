import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Http } from '@angular/http';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Angular2TokenService } from 'angular2-token';

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

const appRoutes: Routes = [
	{
    path: '',
    component: HomeComponent
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
    path: 'event/list',
    component: EventListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'event/add',
    component: EventAddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'event/show/:id',
    component: EventShowComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'event/edit/:id',
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
    LoginFormComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    Angular2FontawesomeModule,
    FormsModule,
    ReactiveFormsModule,
    MainPipe,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [Angular2TokenService, AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
