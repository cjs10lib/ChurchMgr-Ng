import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fadeIn, fadeInDown } from 'ng-animate';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { PersonFamily } from '../../../../models/person-family.model';
import { PersonFamilyService } from '../../../../services/person-family.service';
import { UploadService } from '../../../../services/upload.service';
import { Upload } from './../../../../models/upload.model';
import { PeopleService } from './../../../../services/people.service';

@Component({
  selector: 'app-family-members-list',
  templateUrl: './family-members-list.component.html',
  styleUrls: ['./family-members-list.component.scss'],
  animations: [
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn))]),
    trigger('fadeInDown', [transition('* => *', useAnimation(fadeInDown, {params: { timing: 0.50, delay: 0 }}))]),
  ],
})
export class FamilyMembersListComponent implements OnInit, OnDestroy {

  fadeIn: any;
  fadeInDown: any;

  @Input() parentComponent: string;
  @Input() showControls: boolean;

  routeId: string;
  searchQry: string;

  people$ = [];
  filteredPeople$ = [];
  personGallery: Upload[] = [];

  personFamily: PersonFamily = {};

  showSpinner = true;
  subscription: Subscription;
  gallerySubscription: Subscription;
  membersSubscription: Subscription;

  constructor(private personFamilyService: PersonFamilyService,
    private route: ActivatedRoute, 
    private uploadService: UploadService,
    private peopleService: PeopleService) { }

  ngOnInit() {
    this.gallerySubscription = this.uploadService.getAllGallery().subscribe(resp => {
      this.showSpinner = false;

      this.personGallery = resp;
    });    

    this.loadFamilyMembers();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.gallerySubscription) {
      this.gallerySubscription.unsubscribe();
    }

    if (this.membersSubscription) {
      this.membersSubscription.unsubscribe();
    }
  }

  loadFamilyMembers() {
    
    if (this.parentComponent === 'people-profile') {
      return this.getPersonFamilyMembersFromProfile();
    }

    // else    
    return this.getFamilyMembersFromFamily();    
  }
  
  getPersonFamilyMembersFromProfile() {
    const personId = this.route.parent.snapshot.paramMap.get('id');
    
    this.subscription = this.personFamilyService.getPersonFamily(personId)
      .pipe(switchMap(result => {
        this.personFamily = result;

        const familyId = this.personFamily.familyId;

        return this.personFamilyService.getFamilyMembers(familyId);
      })).subscribe(resp => {
       
        resp.forEach(item => {
          this.getFamilyMemberList(item.personId);
        });
    });
  }

  getFamilyMembersFromFamily() {
    const familyId = this.route.snapshot.paramMap.get('id');

    this.subscription = this.personFamilyService.getFamilyMembers(familyId)
      .subscribe(resp => {
      
        resp.forEach(item => {
          this.getFamilyMemberList(item.personId);
        });
    });
  }

  getFamilyMemberList(personId: string) {
    this.membersSubscription = this.peopleService.getPerson(personId)
      .subscribe(resp => {
      this.people$.push({ 
        id: personId,
        data: resp
      });
    });

    this.filteredPeople$ = this.people$;
  }

  getPersonAvatar(avaterId: string) {
    if (!avaterId) {
      return;
    }

    const index = this.personGallery.findIndex(g => g.Id === avaterId);
    return this.personGallery[index].url;
  }

  search(qry: string) {
    this.filteredPeople$ = qry ?
      this.people$.filter(
        p => p.fullname.toLowerCase().includes(qry.toLowerCase())) : this.people$;
  }

  clearSearchField() {
    this.search('');
    this.searchQry = '';
  }

}
