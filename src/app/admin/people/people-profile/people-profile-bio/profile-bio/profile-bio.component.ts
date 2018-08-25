import { switchMap } from 'rxjs/operators';
import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { zoomIn, fadeOut } from 'ng-animate';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

import { PeopleService } from './../../../../../services/people.service';

@Component({
  selector: 'app-profile-bio',
  templateUrl: './profile-bio.component.html',
  styleUrls: ['./profile-bio.component.scss'],
  animations: [
    trigger('zoomIn', [transition('* => *', useAnimation(zoomIn, {params: { timing: 0.5, delay: 0 }}))])
  ],
})
export class ProfileBioComponent implements OnInit, OnDestroy {

  zoomIn: any;

  person = {};

  showSpinner = true;
  subscription: Subscription;

  constructor(private peopleService: PeopleService, 
    private route: ActivatedRoute) { }

  ngOnInit() {

    this.subscription = this.route.parent.paramMap.pipe(switchMap(params => {
      const personId = params.get('id');

      return this.peopleService.getPerson(personId);
    })).subscribe(resp => {
      this.showSpinner = false;

      this.person = resp;
    });

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
