import { Component, OnInit } from '@angular/core';
import { trigger, transition, useAnimation } from '@angular/animations';
import { zoomIn } from 'ng-animate';

@Component({
  selector: 'app-profile-bio-ext',
  templateUrl: './profile-bio-ext.component.html',
  styleUrls: ['./profile-bio-ext.component.scss'],
  animations: [
    trigger('zoomIn', [transition('* => *', useAnimation(zoomIn, {
      params: { timing: 0.5, delay: 0 }
    }))])
  ],
})
export class ProfileBioExtComponent implements OnInit {

  zoomIn: any;

  parentComponent = 'people-profile';
  showControls = false;

  constructor() { }

  ngOnInit() {
  }

}
