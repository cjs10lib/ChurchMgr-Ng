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
  showSpinner = true;

  subscription: Subscription;

  constructor(private peopleService: PeopleService, private route: ActivatedRoute) {}

  ngOnInit() {
    const personId = this.route.snapshot.paramMap.get('id');

    this.subscription = this.peopleService.getPerson(personId).subscribe(resp => {
      this.person = resp;
      this.person.id = personId;
      this.showSpinner = false;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
