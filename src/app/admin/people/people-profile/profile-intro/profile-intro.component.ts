import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Person } from '../../../../models/person.model';
import { PeopleService } from '../../../../services/people.service';
import { SweetAlertService } from '../../../../services/sweet-alert.service';
import { UploadService } from '../../../../services/upload.service';

@Component({
  selector: 'app-profile-intro',
  templateUrl: './profile-intro.component.html',
  styleUrls: ['./profile-intro.component.scss']
})
export class ProfileIntroComponent implements OnInit, OnDestroy {

  person: Person = {};
  profileImage: string;

  subscription: Subscription;

  constructor(private peopleService: PeopleService, private uploadService: UploadService, private route: ActivatedRoute,
    private router: Router, private sweetAlertService: SweetAlertService) { }

  ngOnInit() {

    this.subscription = this.route.paramMap.pipe(switchMap(params => {
      const personId = params.get('id');
      return this.peopleService.getPerson(personId);
    })).pipe(switchMap(object => {

      this.person = object;
      return this.uploadService.getProfileImage(this.person.profileImage);

    })).subscribe(avatar => {
      if (avatar) {
        this.profileImage = avatar.url;
      }
    });

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  deleteProfile() {
    this.sweetAlertService.confirmDelete().then(resp => {
      if (resp.value) {
        this.peopleService.deletePerson(this.person.id);

        this.sweetAlertService.afterDeleteSuccess();
        this.router.navigate(['people']);
      }
    });
  }

}
