import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { EventService } from '../event.service';

import { Event } from '../event';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  providers: [EventService]
})
export class EventListComponent implements OnInit {

	public events: any;
  public currentEvent: Event = new Event();
  public errorMessage: any;
  public isEventsLoading: boolean = false;
  public isEventDeleting: boolean = false;
  public currentEventId: number;

  constructor(
  	private eventService: EventService,
    private router: Router
  ) { }

  ngOnInit() {

    this.loadCurrentEvent();
  	this.loadEventList();
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

  public deleteEvent(id: number){
    if(confirm("Are you sure?")) {
      this.currentEventId = id;
      this.isEventDeleting = true;
      this.eventService.remove(id).subscribe(
        successResponse => {
          this.isEventDeleting = false;
          this.loadEventList();
        },
        (errorResponse) => {
          this.isEventDeleting = false;
          // this.displayErrors(errorResponse);
        }
      );
    }
  }
}
