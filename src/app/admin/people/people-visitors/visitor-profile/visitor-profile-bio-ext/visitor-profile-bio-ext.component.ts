import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-visitor-profile-bio-ext',
  templateUrl: './visitor-profile-bio-ext.component.html',
  styleUrls: ['./visitor-profile-bio-ext.component.scss']
})
export class VisitorProfileBioExtComponent implements OnInit {

  parentComponent = 'people-profile';
  showControls = false;

  constructor() { }

  ngOnInit() {
  }

}
