import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Person } from '../../../models/person.model';
import { PeopleService } from '../../../services/people.service';

@Component({
  selector: 'app-people-registry',
  templateUrl: './people-registry.component.html',
  styleUrls: ['./people-registry.component.scss']
})
export class PeopleRegistryComponent implements OnInit, OnDestroy {

  pageTitle = 'People';
  pageIcon = '';

  searchQry: string;

  people$: Person[];
  filteredPeople: Person[];

  showSpinner = true;
  subscription: Subscription;

  constructor(private peopleService: PeopleService) { }

  ngOnInit() {
    this.subscription = this.peopleService.getPeople().subscribe(resp => {
      this.people$ = this.filteredPeople = resp;
      this.showSpinner = false;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  search(qry: string) {

    this.filteredPeople = qry ?
    this.people$.filter(
      p => p.fullname.toLowerCase().includes(qry.toLowerCase())) : this.people$;
  }

  clearSearchField() {
    this.search('');
    this.searchQry = '';
  }

}
