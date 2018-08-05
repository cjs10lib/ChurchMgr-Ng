import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap } from 'rxjs/operators';
import { PersonFamilyService } from '../../../../services/person-family.service';
import { PersonFamily } from '../../../../models/person-family.model';
import { Person } from '../../../../models/person.model';
import { PeopleService } from '../../../../services/people.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-family-registry',
  templateUrl: './family-registry.component.html',
  styleUrls: ['./family-registry.component.scss']
})
export class FamilyRegistryComponent implements OnInit, OnDestroy {
  pageTitle = 'Family';
  pageIcon = '';

  searchQry: string;

  families$ = [];
  filteredFamily$ = [];

  showSpinner = true;
  subscription: Subscription;

  constructor(private personFamilyService: PersonFamilyService) { }

  ngOnInit() {
    this.subscription = this.personFamilyService.getFamilies().subscribe(resp => {
      this.families$ = this.filteredFamily$ = resp;
      this.showSpinner = false;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  search(qry: string) {
    this.filteredFamily$ = qry ?
      this.families$.filter(
        f => f.name.toLowerCase().includes(qry.toLowerCase())) : this.families$;
  }

  clearSearchField() {
    this.search('');
    this.searchQry = '';
  }
}
