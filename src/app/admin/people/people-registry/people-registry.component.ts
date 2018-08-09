import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { Person } from '../../../models/person.model';
import { PeopleService } from '../../../services/people.service';
import { UploadService } from '../../../services/upload.service';

@Component({
  selector: 'app-people-registry',
  templateUrl: './people-registry.component.html',
  styleUrls: ['./people-registry.component.scss']
})
export class PeopleRegistryComponent implements OnInit, OnDestroy {

  pageTitle = 'People';
  pageIcon = '';

  searchQry: string;

  people$ = [];
  // filteredPeople: Person[];
  filteredPeople = [];

  showSpinner = true;
  subscription: Subscription;

  constructor(private peopleService: PeopleService, private uploadService: UploadService) { }

  ngOnInit() {
    this.subscription = this.peopleService.getPeople().subscribe(resp => {
      this.showSpinner = false;

      resp.forEach(object => {
        this.uploadService.getProfileImage(object.profileImage).pipe(take(1)).subscribe(result => {


          this.filteredPeople.push({ // for each people record, set person data and avatar
            avatar: result,
            data: object
          });

          this.people$.push({
            avatar: result,
            data: object
          });

        });
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  search(qry: string) {

    this.filteredPeople = qry ?
    this.people$.filter(
      p => p.data.fullname.toLowerCase().includes(qry.toLowerCase())) : this.people$;
  }

  clearSearchField() {
    this.search('');
    this.searchQry = '';
  }

}
