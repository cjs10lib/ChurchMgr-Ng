import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Person } from '../../../../models/person.model';
import { ConvertTimestampService } from '../../../../services/convert-timestamp.service';
import { PeopleService } from '../../../../services/people.service';
import { SweetAlertService } from '../../../../services/sweet-alert.service';
import { UploadService } from './../../../../services/upload.service';

@Component({
  selector: 'app-people-basic-form',
  templateUrl: './people-basic-form.component.html',
  styleUrls: ['./people-basic-form.component.scss']
})
export class PeopleBasicFormComponent implements OnInit, OnDestroy {

  // person model
  person: Person = {
    education: {},
    occupation: {},
    contact: {},
    home: {}
  };

  personId: string;

  step = 0;

  imageUrl = '../../../../../assets/avatars/avatar3.png';
  fileToUpload: FileList;
  isHovering: boolean;

  private basePath = 'Gallery';

  subscription: Subscription;

  constructor(private peopleService: PeopleService,
    private alertService: SweetAlertService,
    private route: ActivatedRoute, private router: Router,
    private uploadService: UploadService,
    private timestampService: ConvertTimestampService) { }

  ngOnInit() {

    this.personId = this.route.snapshot.paramMap.get('id');

    if (this.personId) {

      this.subscription = this.peopleService.getPerson(this.personId).subscribe(resp => {
        this.person = resp;

        // convert from timestamp
        this.person.dob = this.timestampService.timestampToDate(resp.dob);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async onSubmit() {

    const confirm = await this.alertService.confirmUpdate();

    if (confirm.value) {
      if (this.personId) {

         await this.peopleService.updatePerson(this.personId, this.person);

      } else {

        const data = this.peopleService.addPerson(this.person);
        const personId = (await data.personData).id;
        const profileAvatarId = data.profileAvatarId; // get profile image id from people service

        this.uploadService.pushUpload(this.fileToUpload, this.basePath, personId, profileAvatarId);
      }

      this.alertService.afterUpdateSuccess();
      this.router.navigate(['people-profile', this.personId]);
    }
  }

  toggleHover($event: boolean) {
    this.isHovering = $event;
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file;

    if (this.fileToUpload.item(0).type !== 'image') {
      console.log('unsupported file type :( ');
    }

    // show image preview
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    };
    reader.readAsDataURL(this.fileToUpload.item(0));
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}
