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
  fileToUpload: File = null;
  isHovering: boolean;

  subscription: Subscription;

  constructor(private peopleService: PeopleService,
    private sweetAlertService: SweetAlertService, private route: ActivatedRoute, private router: Router) { }

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

        console.log(this.person);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSubmit() {
    this.sweetAlertService.confirmUpdate().then(result => {
      if (result.value) {

        if (this.personId) {
          this.peopleService.updatePerson(this.personId, this.person);
        } else {
          this.peopleService.addPerson(this.person).then(resp => {
            console.log(resp.id);
          });
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
    this.fileToUpload = file.item(0);

    if (this.fileToUpload.type.split('/')[0] !== 'image') {
      console.log('unsupported file type :( ');
    }

    // show image preview
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    };
    reader.readAsDataURL(this.fileToUpload);
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
