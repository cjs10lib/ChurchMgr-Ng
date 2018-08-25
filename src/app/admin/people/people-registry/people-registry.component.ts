import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { fadeIn, fadeInDown, fadeInRight } from 'ng-animate';
import { combineLatest, Subscription } from 'rxjs';

import { Person } from '../../../models/person.model';
import { Upload } from '../../../models/upload.model';
import { PeopleService } from '../../../services/people.service';
import { UploadService } from '../../../services/upload.service';

@Component({
  selector: 'app-people-registry',
  templateUrl: './people-registry.component.html',
  styleUrls: ['./people-registry.component.scss'],
  animations: [
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn))]),
    trigger('fadeInDown', [transition('* => *', useAnimation(fadeInDown, {params: { timing: 0.25, delay: 0 }}))]),
    trigger('fadeInRight', [transition('* => *', useAnimation(fadeInRight, {params: { timing: 0.75, delay: 0 }}))]),
  ],
})
export class PeopleRegistryComponent implements OnInit, OnDestroy {

  fadeIn: any;
  fadeInDown: any;
  fadeInRight: any;

  // breadcrum
  pageTitle = 'People';
  pageIcon = '';

  // search Qry
  searchQry: string;

  // people
  people: Person[] = [];
  filteredPeople: Person[] = [];

  peopleGallery: Upload[] = []

  showSpinner = true;
  subscription: Subscription;

  constructor(private peopleService: PeopleService,
    private uploadService: UploadService) { }

  ngOnInit() {

    this.subscription = combineLatest(this.peopleService.getPeople(), this.uploadService.getAllGallery())
      .subscribe(resp => {
        this.showSpinner = false;

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
