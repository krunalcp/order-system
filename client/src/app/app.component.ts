import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HostappService } from './hostapp.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HostappService]
})
export class AppComponent {
  title = 'app';

  constructor(
    public hostAppService: HostappService,
    public router: Router,
    public route: ActivatedRoute
  ){}

  public dispHost(){
  	return this.hostAppService.getHost();
  }
}
