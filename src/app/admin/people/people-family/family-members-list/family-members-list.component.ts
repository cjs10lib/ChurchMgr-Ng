import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { PersonFamily } from '../../../../models/person-family.model';
import { PeopleService } from '../../../../services/people.service';
import { PersonFamilyService } from '../../../../services/person-family.service';
import { UploadService } from '../../../../services/upload.service';

@Component({
  selector: 'app-family-members-list',
  templateUrl: './family-members-list.component.html',
  styleUrls: ['./family-members-list.component.scss']
})
export class FamilyMembersListComponent implements OnInit, OnDestroy {

  @Input() parentComponent: string;
  @Input() showControls: boolean;

  // pageTitle = 'Family Members';
  // pageIcon = '';

  routeId: string;
  searchQry: string;

  people$ = [];
  filteredPeople$ = [];

  showSpinner = true;
  familySubscription: Subscription;
  peopleSubscription: Subscription;

  constructor(private personFamilyService: PersonFamilyService,
    private peopleService: PeopleService, private route: ActivatedRoute, private uploadService: UploadService) { }


  ngOnInit() {

    if (this.parentComponent === 'people-profile') {

      this.routeId = this.route.parent.snapshot.paramMap.get('id');
      return this.getFamilyMembersFromPeopleProfile();

    } else {

      this.routeId = this.route.snapshot.paramMap.get('id');
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

          const familyId = resp ? resp.familyId : null; // If family exists, useId else null
          return this.personFamilyService.getFamilyMembers(familyId);

       })).
        subscribe(resp => {

          this.people$ = this.filteredPeople$ = [];

          if (resp) {

              resp.forEach(doc => {
                const personId = doc['personId'];

                // this.peopleSubscription = this.peopleService.getPerson(personId).subscribe(result => {
                this.peopleSubscription = this.peopleService.getPerson(personId).subscribe(data => {

                  this.uploadService.getProfileImage(data.profileImage).pipe(take(1)).subscribe(avatar => {

                    this.people$.push({
                      personId: personId, data: data, avatar: avatar
                    });

                    this.filteredPeople$ = this.people$;

                  });
              });
            });

          }


      });

  }

  private getFamilyMembersFromFamilyProfile() {
    this.familySubscription = this.personFamilyService.getFamilyMembers(this.routeId).subscribe(resp => {

      this.showSpinner = false;
      this.people$ = this.filteredPeople$ = [];

      resp.forEach(person => {

        const personId = person.personId;

        // get people
        this.peopleSubscription = this.peopleService.getPerson(personId).subscribe(data => {

          if (!data.profileImage) {
            return;
          }

          this.uploadService.getProfileImage(data.profileImage).pipe(take(1)).subscribe(avatar => {

            this.people$.push({
              personId: personId, data: data, avatar: avatar
            });

            this.filteredPeople$ = this.people$;

          });

        });
      });
    });
  }

  search(qry: string) {
    this.filteredPeople$ = qry ?
      this.people$.filter(
        p => p.data.fullname.toLowerCase().includes(qry.toLowerCase())) : this.people$;
  }

  clearSearchField() {
    this.search('');
    this.searchQry = '';
  }

}
