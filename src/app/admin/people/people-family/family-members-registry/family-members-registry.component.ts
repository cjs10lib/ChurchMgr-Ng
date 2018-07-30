import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-family-members-registry',
  templateUrl: './family-members-registry.component.html',
  styleUrls: ['./family-members-registry.component.scss']
})
export class FamilyMembersRegistryComponent implements OnInit {

  parentComponent = 'people-profile';
  showControls = true;

  constructor() {}

  ngOnInit() {}

}
