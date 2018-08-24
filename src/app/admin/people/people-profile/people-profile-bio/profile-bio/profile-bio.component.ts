import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { zoomIn } from 'ng-animate';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

import { PeopleService } from './../../../../../services/people.service';

@Component({
  selector: 'app-profile-bio',
  templateUrl: './profile-bio.component.html',
  styleUrls: ['./profile-bio.component.scss'],
  animations: [
    trigger('zoomIn', [transition('* => *', useAnimation(zoomIn, {
      params: { timing: 0.5, delay: 0 }
    }))])
  ],
})
export class ProfileBioComponent implements OnInit, OnDestroy {

  zoomIn: any;

  person = {};

  subscription: Subscription;
  personSubscription: Subscription;

  constructor(private peopleService: PeopleService, 
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();

    let personId;
    this.subscription = this.route.parent.paramMap.subscribe(prams => {
      this.spinner.hide();

      personId = prams.get('id');
      
      this.peopleService.getPerson(personId).subscribe(resp => {
        this.person = resp;
      });
    });

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.personSubscription) {
      this.personSubscription.unsubscribe();
    }
  }

}
