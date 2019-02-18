import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Http } from '@angular/http';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { MainPipe } from './main-pipe.module';

const appRoutes: Routes = [
	{
    path: '',
    component: HomeComponent
  },
	{
    path: 'item/list',
    component: ItemListComponent
  },
  {
    path: 'item/add',
    component: ItemAddComponent
  },
  {
    path: 'item/show/:id',
    component: ItemShowComponent
  },
  {
    path: 'item/edit/:id',
    component: ItemEditComponent
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
    path: 'order/list',
    component: OrderListComponent
  },
  {
    path: 'order/list/:id',
    component: OrderListComponent
  },
  {
    path: 'order/show/:id',
    component: OrderShowComponent
  },
  {
    path: 'order/add',
    component: OrderAddComponent
  },
  {
    path: 'order/edit/:id',
    component: OrderEditComponent
  },
  {
    path: 'station/order',
    component: StationOrdersComponent
  },
  {
    path: 'station/list',
    component: StationListComponent
  },
  {
    path: 'station/show/:id',
    component: StationShowComponent
  },
  {
    path: 'station/add',
    component: StationAddComponent
  },
  {
    path: 'station/edit/:id',
    component: StationEditComponent
  },
  {
    path: 'order/summary',
    component: OrderSummaryComponent
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
