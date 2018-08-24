import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { combineLatest, Subscription } from 'rxjs';

import { Person } from '../../../models/person.model';
import { Upload } from '../../../models/upload.model';
import { PeopleService } from '../../../services/people.service';
import { UploadService } from '../../../services/upload.service';
import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeIn, fadeInDown } from 'ng-animate';

@Component({
  selector: 'app-people-registry',
  templateUrl: './people-registry.component.html',
  styleUrls: ['./people-registry.component.scss'],
  animations: [
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn))]),
    trigger('fadeInDown', [transition('* => *', useAnimation(fadeInDown))])
  ],
})
export class PeopleRegistryComponent implements OnInit, OnDestroy {

  fadeIn: any;
  fadeInDown: any;

  // breadcrum
  pageTitle = 'People';
  pageIcon = '';

  // search Qry
  searchQry: string;

  // people
  people: Person[] = [];
  filteredPeople: Person[] = [];

  peopleGallery: Upload[] = []

  subscription: Subscription;

  constructor(private peopleService: PeopleService,
    private uploadService: UploadService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();

    this.subscription = combineLatest(this.peopleService.getPeople(), this.uploadService.getAllGallery())
      .subscribe(resp => {
        this.spinner.hide();

        this.people = this.filteredPeople = resp[0];
        this.peopleGallery = resp[1];
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getPeopleAvatar(avaterId: string) {
    if (!avaterId) {
      return;
    }

    const index = this.peopleGallery.findIndex(g => g.Id === avaterId);
    return this.peopleGallery[index].url;
  }

  search(qry: string) {

    this.filteredPeople = qry ?
    this.people.filter(
      p => p.fullname.toLowerCase().includes(qry.toLowerCase())) : this.people;
  }

  clearSearchField() {
    this.search('');
    this.searchQry = '';
  }

}
