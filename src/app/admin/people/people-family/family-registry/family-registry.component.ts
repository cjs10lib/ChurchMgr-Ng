import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap } from '../../../../../../node_modules/rxjs/operators';
import { PersonFamilyService } from '../../../../services/person-family.service';
import { PersonFamily } from './../../../../models/person-family.model';
import { Person } from './../../../../models/person.model';
import { PeopleService } from './../../../../services/people.service';
import { Subscription } from '../../../../../../node_modules/rxjs';

@Component({
  selector: 'app-family-registry',
  templateUrl: './family-registry.component.html',
  styleUrls: ['./family-registry.component.scss']
})
export class FamilyRegistryComponent implements OnInit, OnDestroy {

  @Input() personId: string;

  people$ = [];

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
                personId: personId,
                person: result
              });
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

}
