import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { EventOrderService } from '../event_order.service';
import { Event } from '../event';

@Injectable()
export class EventAuthGuard implements CanActivate {
  public currentEvent: Event = new Event();

  constructor(
    private router: Router,
    private eventOrderService: EventOrderService
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('event_access_token')) {
      return true;
    }

    this.router.navigate([next.params.event+'/login']);
    return false;
  }
}
