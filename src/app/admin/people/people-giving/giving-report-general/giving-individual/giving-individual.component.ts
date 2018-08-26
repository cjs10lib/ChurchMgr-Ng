import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { fadeIn, fadeInDown } from 'ng-animate';
import { combineLatest, Subscription } from 'rxjs';

import { Upload } from '../../../../../models/upload.model';
import { PeopleService } from '../../../../../services/people.service';
import { Giving } from './../../../../../models/person-giving.model';
import { PersonGivingService } from './../../../../../services/person-giving.service';
import { UploadService } from './../../../../../services/upload.service';

@Component({
  selector: 'app-giving-individual',
  templateUrl: './giving-individual.component.html',
  styleUrls: ['./giving-individual.component.scss'],
  animations: [
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn))]),
    trigger('fadeInDown', [transition('* => *', useAnimation(fadeInDown, {params: { timing: 0.25, delay: 0 }}))]),
  ],
})
export class GivingIndividualComponent implements OnInit, OnDestroy {

  fadeIn: any;
  fadeInDown: any;

  // search Qry
  searchQry: string;

  // people
  people = [];
  filteredPeople = [];
  peopleWithGiving = []

  // giving
  peopleGiving: Giving[] = [];

  // giving
  peopleGallery: Upload[] = [];

  showSpinner = true;
  subscription: Subscription;
  givingSubscription: Subscription;

  constructor(private givingService: PersonGivingService, 
    private peopleService: PeopleService, 
    private uploadService: UploadService) { }

  ngOnInit() {
    this.subscription = combineLatest(
      this.peopleService.getPeople(), 
      this.givingService.getGivings(),
      this.uploadService.getAllGallery()
    ).subscribe(resp => {
      this.showSpinner = false;
      
      this.people = resp[0];
      this.peopleGiving = resp[1];
      this.peopleGallery = resp[2];

      if (this.peopleGiving && this.people) {

        let peopleWithGiving = []
        this.people.forEach(item => {
  
          // if (item.data.tag === 'person') {
            const person = this.peopleGiving.find(p => p.data.person === item.id);
  
            if (!peopleWithGiving.find(p => p.id === item.id) && person !== null) {
              peopleWithGiving.push(item);
            }
          // }
        });
  
        this.filteredPeople = peopleWithGiving;        
      }
      
    });       
    
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.givingSubscription) {
      this.givingSubscription.unsubscribe();
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
