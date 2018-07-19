import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-people-basic-form',
  templateUrl: './people-basic-form.component.html',
  styleUrls: ['./people-basic-form.component.scss']
})
export class PeopleBasicFormComponent implements OnInit {
  step = 0;

  imageUrl = '../../assets/avatar/avatar3.png';
  fileToUpload: File = null;
  isHovering: boolean;

  person = {
    education: {},
    occupation: {},
    contact: {}
  };

  constructor() { }

  ngOnInit() {
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
