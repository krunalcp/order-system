import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { EventService } from '../event.service';

import { Event } from '../event';

@Component({
  selector: 'app-event-show',
  templateUrl: './event-show.component.html',
  styleUrls: ['./event-show.component.css']
})
export class EventShowComponent implements OnInit {

  public errorMessage: any;
  public event: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) { }

  ngOnInit() {

  	this.route.params.subscribe(
      (params: any) => {
        let id : number = params.id;
        this.getEvent(id);
      }
    );
  }

  private getEvent(id: number): void {
    this.eventService.show(id).subscribe(
      successResponse => {
        this.event = successResponse.json();
        console.log(successResponse.json())
      },
      () => {
        this.errorMessage = 'Failed to load event.';
      }
    );
  }


}
