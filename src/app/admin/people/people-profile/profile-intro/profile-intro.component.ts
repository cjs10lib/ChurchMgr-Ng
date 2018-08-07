import { Component, OnDestroy, OnInit } from '@angular/core';
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
    const personId = this.route.snapshot.paramMap.get('id');

    this.subscription = this.peopleService.getPerson(personId).pipe(switchMap(resp => {

      this.person = resp;
      return this.uploadService.getProfileImage(resp.profileImage);

    })).subscribe(img => {

        if (img) {
          this.profileImage = img.url;
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
