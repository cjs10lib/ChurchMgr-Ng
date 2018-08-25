import { trigger, transition, useAnimation } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { PersonFamilyService } from '../../../../services/person-family.service';
import { fadeIn, fadeInDown } from 'ng-animate';

@Component({
  selector: 'app-family-registry',
  templateUrl: './family-registry.component.html',
  styleUrls: ['./family-registry.component.scss'],
  animations: [
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn))]),
    trigger('fadeInDown', [transition('* => *', useAnimation(fadeInDown, {params: { timing: 0.25, delay: 0 }}))]),
  ],
})
export class FamilyRegistryComponent implements OnInit, OnDestroy {

  fadeIn: any;
  fadeInDown: any;

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
