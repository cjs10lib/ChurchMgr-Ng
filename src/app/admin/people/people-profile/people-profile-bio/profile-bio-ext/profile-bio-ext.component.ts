import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-bio-ext',
  templateUrl: './profile-bio-ext.component.html',
  styleUrls: ['./profile-bio-ext.component.scss']
})
export class ProfileBioExtComponent implements OnInit {

  parentComponent = 'people-profile';
  showControls = false;

  constructor() { }

  ngOnInit() {
  }

}
