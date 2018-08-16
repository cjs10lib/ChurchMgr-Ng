import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { PeopleService } from './../../../../../services/people.service';

@Component({
  selector: 'app-profile-bio',
  templateUrl: './profile-bio.component.html',
  styleUrls: ['./profile-bio.component.scss']
})
export class ProfileBioComponent implements OnInit, OnDestroy {

  personData;

  subscription: Subscription;

  constructor(private peopleService: PeopleService, private route: ActivatedRoute) { }

  ngOnInit() {
    // const personId = this.route.parent.snapshot.paramMap.get('id');
    this.subscription = this.route.parent.paramMap.subscribe(prams => {

      const personId = prams.get('id');
      this.personData = this.peopleService.getPerson(personId);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
