import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { HeaderService } from "../services/header.service";

@Component({
  selector: 'app-event-order-list',
  templateUrl: './event-order-list.component.html',
  styleUrls: ['./event-order-list.component.css'],
  providers: [EventService]
})
export class EventOrderListComponent implements OnInit {
  public events: any;
  public isEventsLoading: boolean = false;

  constructor(
    private eventService: EventService,
    private header: HeaderService
  ) {
    this.header.changeMessage(false)
  }

  ngOnInit() {
    this.loadEventList();
  }

  ngAfterContentChecked(){
  }

  public loadEventList(){
    this.isEventsLoading = true;
    this.eventService.list().subscribe(
      successResponse => {
        this.events = successResponse.json();
        this.isEventsLoading = false;
      },
      (errorResponse) => {
        // this.displayErrors(errorResponse);
      }
    );
  }

}
