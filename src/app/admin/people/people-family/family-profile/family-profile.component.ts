import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-family-profile',
  templateUrl: './family-profile.component.html',
  styleUrls: ['./family-profile.component.scss']
})
export class FamilyProfileComponent implements OnInit {

  parentComponent = 'family-profile';
  showControls = true;

  constructor() {}

  ngOnInit() {}

}
