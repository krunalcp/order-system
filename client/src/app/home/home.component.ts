import { Component, OnInit } from '@angular/core';

import { EventService } from '../event.service';
import { Event } from '../event';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [
    EventService
  ]
})

export class HomeComponent implements OnInit {
  public currentEvent: Event = new Event();
  public errorMessage: any;

  constructor(
    public eventService: EventService
  ) { }

  ngOnInit() {
    this.loadCurrentEvent();
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
}
