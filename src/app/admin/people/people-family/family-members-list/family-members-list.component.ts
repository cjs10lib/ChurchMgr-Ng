import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from '../../../../../../node_modules/rxjs';
import { PersonFamilyService } from '../../../../services/person-family.service';
import { PeopleService } from '../../../../services/people.service';
import { switchMap } from '../../../../../../node_modules/rxjs/operators';
import { PersonFamily } from '../../../../models/person-family.model';

@Component({
  selector: 'app-family-members-list',
  templateUrl: './family-members-list.component.html',
  styleUrls: ['./family-members-list.component.scss']
})
export class FamilyMembersListComponent implements OnInit, OnDestroy {

  @Input() parentComponent: string;
  @Input() showControls: boolean;

  routeId: string;
  searchQry: string;

  people$ = [];
  filteredPeople$ = [];

  showSpinner = true;
  familySubscription: Subscription;
  peopleSubscription: Subscription;

  constructor(private personFamilyService: PersonFamilyService,
    private peopleService: PeopleService, private route: ActivatedRoute) { }


  ngOnInit() {

    this.routeId = this.route.snapshot.paramMap.get('id');

    if (this.parentComponent === 'people-profile') {
      return this.getFamilyMembersFromPeopleProfile();
    } else if (this.parentComponent === 'family-profile') {
      return this.getFamilyMembersFromFamilyProfile();
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

  private getFamilyMembersFromPeopleProfile() {

    this.familySubscription = this.personFamilyService.getPersonFamily(this.routeId)
        .pipe(switchMap((resp: PersonFamily) => {
          this.showSpinner = false;

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
          });
        });

      });

  }

  private getFamilyMembersFromFamilyProfile() {
    this.familySubscription = this.personFamilyService.getFamilyMembers(this.routeId).subscribe(resp => {

      this.showSpinner = false;

      resp.forEach(p => {
        // get people
        this.peopleSubscription = this.peopleService.getPerson(p.personId).subscribe(result => {
          this.people$.push({
            personId: p.personId,
            person: result
          });

          this.filteredPeople$.push({
            personId: p.personId,
            person: result
          });

        });
      });
    });
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
