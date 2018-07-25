import { Subscription } from 'rxjs';
import { PeopleService } from '../../../services/people.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Person } from '../../../models/person.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-people-profile',
  templateUrl: './people-profile.component.html',
  styleUrls: ['./people-profile.component.scss']
})
export class PeopleProfileComponent implements OnInit, OnDestroy {

  person: Person = {};
  personId: string;
  showSpinner = true;

  subscription: Subscription;

  constructor(private peopleService: PeopleService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.personId = this.route.snapshot.paramMap.get('id');
    // this.route.paramMap.subscribe(prams => {
    //   this.personId =  prams.get('id');
    //   console.log(this.personId);
    // });

    this.subscription = this.peopleService.getPerson(this.personId).subscribe(resp => {
      this.person = resp;
      this.person.id = this.personId;
      this.showSpinner = false;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
