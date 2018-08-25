import { switchMap } from 'rxjs/operators';
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
import { fadeIn, fadeInRight  } from 'ng-animate';

@Component({
  selector: 'app-profile-intro',
  templateUrl: './profile-intro.component.html',
  styleUrls: ['./profile-intro.component.scss'],
  animations: [
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn, {params: { timing: 0.50, delay: 0 }}))]),
    trigger('fadeInRight', [transition('* => *', useAnimation(fadeInRight, {params: { timing: 0.50, delay: 0 }}))]),
    trigger('fadeInRight1', [transition('* => *', useAnimation(fadeInRight, {params: { timing: 1, delay: 0.5 }}))]),
  ],
})
export class ProfileIntroComponent implements OnInit, OnDestroy {

  fadeIn: any;
  fadeInRight: any;
  fadeInRight1: any;

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
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();

    this.paramSubscription = this.route.paramMap.pipe(switchMap(params => {
      this.personId = params.get('id');

      return combineLatest(this.peopleService.getPerson(this.personId), 
        this.uploadService.getPersonGallery(this.personId));
    })).subscribe(resp => {
      this.spinner.hide();

      this.person = resp[0];
      this.personGallery = resp[1];
    });
  }

  ngOnDestroy(): void {
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
