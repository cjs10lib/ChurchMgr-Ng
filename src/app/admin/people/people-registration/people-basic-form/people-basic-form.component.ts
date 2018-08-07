import { UploadService } from './../../../../services/upload.service';
import { SweetAlertService } from '../../../../services/sweet-alert.service';
import { PeopleService } from '../../../../services/people.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {
  trigger,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger
} from '@angular/animations';
import { Person } from '../../../../models/person.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-people-basic-form',
  templateUrl: './people-basic-form.component.html',
  styleUrls: ['./people-basic-form.component.scss'],
  animations: [
    trigger('listStagger', [
      transition('* <=> *', [
        query(':enter',
        [
          style({opacity: 0, transform: ' translateY(-15px)' }),
          stagger('50ms',
          animate('550ms ease-out',
          style({ opacity: 1, transform: 'translateY(0px)' })))
        ], { optional: true }),
        query(':leave', animate('50ms', style({ opacity: 0 })), {
          optional: true
        })
      ])
    ])
  ]
})
export class PeopleBasicFormComponent implements OnInit, OnDestroy {

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
    private sweetAlertService: SweetAlertService, private route: ActivatedRoute,
    private router: Router, private uploadService: UploadService) { }

  ngOnInit() {

    this.personId = this.route.snapshot.paramMap.get('id');

    if (this.personId) {

      this.subscription = this.peopleService.getPerson(this.personId).subscribe((resp: Person) => {
        this.person = resp;
        this.person.dob = resp.dob;
        this.person.education = resp.education;
        this.person.occupation = resp.occupation;
        this.person.contact = resp.contact;
        this.person.home = resp.home;
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSubmit() {
    this.sweetAlertService.confirmUpdate().then(async result => {
      if (result.value) {

        if (this.personId) {

          await this.peopleService.updatePerson(this.personId, this.person);

        } else {
          const data = this.peopleService.addPerson(this.person);

          this.personId = (await data.personData).id;
          const profileImgId = data.profileImgId; // get profile image id from people service

          this.uploadService.pushUpload(this.fileToUpload, this.basePath, this.personId, profileImgId);
        }

        this.sweetAlertService.afterUpdateSuccess();
        this.router.navigate(['people-profile', this.personId]);
      }
    });
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
