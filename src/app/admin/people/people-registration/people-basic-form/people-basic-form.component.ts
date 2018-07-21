import { PeopleService } from './../../../../services/people.service';
import { Component, OnInit } from '@angular/core';
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
export class PeopleBasicFormComponent implements OnInit {
  step = 0;

  people$;

  imageUrl = '../../../../../assets/avatars/avatar3.png';
  fileToUpload: File = null;
  isHovering: boolean;

  person: Person = {
    education: {},
    occupation: {},
    contact: {},
    home: {}
  };

  constructor(private peopleService: PeopleService) { }

  ngOnInit() {
    this.peopleService.getPeople().subscribe(resp => {
      console.log(resp);
    });
  }

  onSubmit() {
    this.peopleService.addPerson(this.person).then(resp => {
      console.log(resp.id);
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
