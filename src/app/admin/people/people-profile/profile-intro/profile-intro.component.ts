import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { combineLatest, Subscription } from 'rxjs';

import { Person } from '../../../../models/person.model';
import { PeopleService } from '../../../../services/people.service';
import { SweetAlertService } from '../../../../services/sweet-alert.service';
import { UploadService } from '../../../../services/upload.service';
import { Upload } from './../../../../models/upload.model';
import { trigger, transition, useAnimation } from '@angular/animations';
import { fadeIn, fadeInDown } from 'ng-animate';

@Component({
  selector: 'app-profile-intro',
  templateUrl: './profile-intro.component.html',
  styleUrls: ['./profile-intro.component.scss'],
  animations: [
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn))]),
    trigger('fadeInDown', [transition('* => *', useAnimation(fadeInDown))])
  ],
})
export class ProfileIntroComponent implements OnInit, OnDestroy {

  fadeIn: any;
  fadeInDown: any;

  personId: string;
  person: Person = {};
  personGallery: Upload[] = [];

  subscription: Subscription;
  paramSubscription: Subscription;

  constructor(private peopleService: PeopleService, 
    private uploadService: UploadService, 
    private route: ActivatedRoute,
    private router: Router, 
    private sweetAlertService: SweetAlertService,
    private spinner: NgxSpinnerService) {

    this.paramSubscription = this.route.paramMap.subscribe(params => {
      this.personId = params.get('id');
    });
  }

  ngOnInit() {
    this.spinner.show();

    this.subscription = combineLatest(this.peopleService.getPerson(this.personId), 
      this.uploadService.getPersonGallery(this.personId)
    ).subscribe(resp => {
      this.spinner.hide();

      this.person = resp[0];
      this.personGallery = resp[1];

    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
  }

  getPersonAvatar(avaterId: string) {
    if (!avaterId) {
      return;
    }

    const index = this.personGallery.findIndex(g => g.Id === avaterId);
    return this.personGallery[index].url;
  }

  editProfile() {
    this.router.navigate(['people-profile', this.personId, 'profile-Edit']);
  }

  async deleteProfile() {
    const confirm = await this.sweetAlertService.confirmDelete();
    if (confirm.value) {
      this.peopleService.deletePerson(this.person.id);

      this.sweetAlertService.afterDeleteSuccess();
      this.router.navigate(['people']);
    }   
  }

}
