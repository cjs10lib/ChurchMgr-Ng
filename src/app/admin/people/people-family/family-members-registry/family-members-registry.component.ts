import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PeopleService } from '../../../../services/people.service';
import { PersonFamilyService } from '../../../../services/person-family.service';
import { PersonFamily } from '../../../../models/person-family.model';
import { switchMap } from '../../../../../../node_modules/rxjs/operators';

@Component({
  selector: 'app-family-members-registry',
  templateUrl: './family-members-registry.component.html',
  styleUrls: ['./family-members-registry.component.scss']
})
export class FamilyMembersRegistryComponent implements OnInit, OnDestroy {

  searchQry: string;

  @Input() personId: string;

  people$ = [];
  filteredPeople$ = [];

  showSpinner = true;
  familySubscription: Subscription;
  peopleSubscription: Subscription;

  constructor(private personFamilyService: PersonFamilyService,
    private peopleService: PeopleService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    if (this.personId) {

      this.familySubscription = this.personFamilyService.getPersonFamily(this.personId)
        .pipe(switchMap((resp: PersonFamily) => {
          const familyId = resp.familyId;
          return this.personFamilyService.getFamilyMembers(familyId);
       })).
        subscribe(resp => {

          resp.forEach(doc => {
            const personId = doc['personId'];

            this.peopleSubscription = this.peopleService.getPerson(personId).subscribe(result => {
              this.people$.push({
                personId: personId, person: result
              });

              this.filteredPeople$.push({
                personId: personId, person: result
              });

              this.showSpinner = false;
          });
        });

      });

    }

  }

  ngOnDestroy(): void {
    if (this.familySubscription) {
      this.familySubscription.unsubscribe();
    }

    if (this.peopleSubscription) {
      this.peopleSubscription.unsubscribe();
    }
  }

  search(qry: string) {
    this.filteredPeople$ = qry ?
      this.people$.filter(
        p => p.person.fullname.toLowerCase().includes(qry.toLowerCase())) : this.people$;
  }

  clearSearchField() {
    this.search('');
    this.searchQry = '';
  }

}
